import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("展墙、筛选与空结果可恢复", async ({ page }) => {
  await page.goto("/stories");
  await expect(
    page.getByRole("heading", { name: "每一种美，都有自己的声音。" }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveCount(8);
  await page.getByRole("button", { name: "列表浏览", exact: true }).click();
  await page.getByRole("button", { name: "勇敢", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "不必收起我的锋芒" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "搜索故事、音乐或关键词" })
    .fill("没有这段旋律");
  await page.getByRole("button", { name: "搜索", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "还没有找到匹配的故事。" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "清除筛选，查看全部" }).click();
  await expect(page.locator("article")).toHaveCount(3);
  await page.getByRole("button", { name: "下一页 →" }).click();
  await expect(
    page.getByRole("heading", { name: "不必收起我的锋芒" }),
  ).toBeVisible();
});
test("故事过渡、返回位置与深链", async ({ page }) => {
  await page.goto("/stories?view=wall");
  const card = page.getByRole("link", { name: /把自由，画成我的颜色.*03/ });
  await card.scrollIntoViewIfNeeded();
  const scroll = await page.evaluate(() => scrollY);
  await card.click();
  await expect(page).toHaveURL(/color-of-freedom/);
  await expect(page.locator("h1")).toHaveText("把自由，画成我的颜色");
  await page.waitForTimeout(800);
  await expect(page.locator("img[aria-hidden=true]")).toHaveCount(0);
  await page.getByRole("button", { name: "返回故事展览" }).click();
  await expect(page).toHaveURL(/view=wall/);
  await page.waitForTimeout(300);
  expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(
    80,
  );
  await page.goto("/stories/no-such-story");
  await expect(
    page.getByRole("heading", { name: "这个故事，暂时无法打开。" }),
  ).toBeVisible();
});
test("清单数量、保存和商城衔接", async ({ page }) => {
  await page.goto("/stories/gentle-strength");
  await page.getByRole("button", { name: "一键选购同款" }).click();
  await expect(page).toHaveURL("/selection");
  await expect(
    page.getByRole("complementary", { name: "清单摘要" }),
  ).toContainText("已选 2 件");
  await page
    .getByRole("button", { name: "增加Colour Riche 缎光唇膏数量" })
    .click();
  await expect(
    page.getByRole("complementary", { name: "清单摘要" }),
  ).toContainText("已选 3 件");
  await page.reload();
  await expect(
    page.getByRole("complementary", { name: "清单摘要" }),
  ).toContainText("已选 3 件");
  await page.getByRole("link", { name: /一键选购已选 3 件/ }).click();
  await expect(page).toHaveURL("/shop-handoff");
  await expect(
    page.getByRole("link", { name: /Colour Riche 缎光唇膏/ }),
  ).toHaveAttribute("href", /lorealparisusa.com/);
  await page.getByRole("combobox", { name: "购买地区" }).selectOption("cn");
  await expect(
    page.getByRole("link", { name: "前往中国官方渠道" }),
  ).toBeVisible();
});
test("分享、阅读设置与减少动态效果", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/stories/gentle-strength");
  await page.getByRole("button", { name: "分享故事" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "复制故事链接", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("故事链接已复制");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "/stories/gentle-strength",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "阅读设置", exact: true }).click();
  await page.getByRole("button", { name: "减少动态效果", exact: true }).click();
  await page.getByRole("button", { name: "放大", exact: true }).click();
  await page.getByRole("button", { name: "保存并返回", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  await expect(page.locator("html")).toHaveAttribute("data-text", "large");
});
test("桌面与手机无溢出、素材有效、基础无障碍", async ({ page }) => {
  for (const width of [1512, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/stories",
      "/stories?view=list",
      "/stories/gentle-strength",
      "/products/colour-riche",
      "/selection",
      "/shop-handoff",
      "/impact",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${path} at ${width}`,
      ).toBeTruthy();
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter(
              (i) =>
                (i as HTMLImageElement).complete &&
                (i as HTMLImageElement).naturalWidth === 0,
            )
            .map((i) => i.getAttribute("src")),
        );
      expect(broken, path).toEqual([]);
    }
    await page.goto("/stories");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test("列表操作返回保留页码、滚动与键盘焦点", async ({ page }) => {
  await page.goto("/stories?view=list&page=2");
  const action = page.getByRole("link", { name: "阅读 / 收听故事 →" }).first();
  await action.scrollIntoViewIfNeeded();
  const id = await action.getAttribute("id");
  const scroll = await page.evaluate(() => scrollY);
  await action.click();
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: "返回故事展览" }).click();
  await expect(page).toHaveURL(/view=list.*page=2/);
  await expect(page.locator(`[id="${id}"]`)).toBeFocused();
  expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(
    80,
  );
});

test("产品清单刷新后仍回到来源故事", async ({ page }) => {
  await page.goto("/products/colour-riche?story=color-of-freedom");
  await page.getByRole("button", { name: "加入妆容清单", exact: true }).click();
  await page.getByRole("link", { name: "查看妆容清单 →" }).click();
  await expect(page).toHaveURL("/selection");
  await expect(page.locator("main")).toContainText(
    "来自「把自由，画成我的颜色」",
  );
  await page.reload();
  await expect(page.getByRole("link", { name: "← 返回故事" })).toHaveAttribute(
    "href",
    "/stories/color-of-freedom",
  );
  await expect(
    page.getByRole("link", { name: "查看色号 / 产品详情" }).first(),
  ).toHaveAttribute("href", "/products/colour-riche?story=color-of-freedom");
});

test("损坏的旧清单不影响有效商品与阅读偏好，手机可打开清单", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "beauty-selection",
      JSON.stringify([
        null,
        { id: "missing", quantity: 1, selected: true },
        { id: "colour-riche", quantity: 2, selected: true },
        { id: "colour-riche", quantity: 9, selected: true },
      ]),
    );
    localStorage.setItem(
      "beauty-preferences",
      JSON.stringify({ large: true, motion: "reduce" }),
    );
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/stories");
  const cart = page
    .locator("header")
    .getByRole("link", { name: "妆容清单 (1)" });
  await expect(cart).toBeVisible();
  await cart.click();
  await expect(
    page.getByRole("complementary", { name: "清单摘要" }),
  ).toContainText("已选 2 件");
  await expect(page.locator("html")).toHaveAttribute("data-text", "large");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
});

test("朗读可暂停、继续、停止，旧回调不会打断重播", async ({ page }) => {
  await page.addInitScript(() => {
    const speech = {
      current: null as any,
      speak(u: any) {
        this.current = u;
      },
      cancel() {},
      pause() {},
      resume() {},
    };
    Object.defineProperty(window, "speechSynthesis", {
      value: speech,
      configurable: true,
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: class {
        text: string;
        constructor(text: string) {
          this.text = text;
        }
      },
      configurable: true,
    });
  });
  await page.goto("/stories/gentle-strength");
  await page.getByRole("button", { name: "▷ 播放故事解说" }).click();
  await page.getByRole("button", { name: "Ⅱ 暂停朗读" }).click();
  await expect(page.getByText("已暂停", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "▷ 继续朗读" }).click();
  await page.evaluate(() => {
    (window as any).previousUtterance = (speechSynthesis as any).current;
  });
  await page.getByRole("button", { name: "停止朗读", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "▷ 播放故事解说" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "▷ 播放故事解说" }).click();
  await page.evaluate(() => {
    (window as any).previousUtterance.onerror({ error: "interrupted" });
  });
  await expect(page.getByRole("button", { name: "Ⅱ 暂停朗读" })).toBeVisible();
  await page.getByRole("combobox", { name: "朗读速度" }).selectOption("1.2");
  await expect(
    page.getByRole("button", { name: "▷ 播放故事解说" }),
  ).toBeVisible();
});
