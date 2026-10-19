import { test, expect } from "@playwright/test";

test("重新一键选购会选中推荐产品并保留已有数量", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "beauty-selection",
      JSON.stringify([
        { id: "colour-riche", quantity: 3, selected: false },
        { id: "true-match-foundation", quantity: 1, selected: false },
        { id: "true-match-blush", quantity: 1, selected: false },
      ]),
    ),
  );
  await page.goto("/stories/gentle-strength");
  await page.getByRole("button", { name: "一键选购同款" }).click();
  await expect(
    page.getByRole("complementary", { name: "清单摘要" }),
  ).toContainText("已选 4 件");
  await expect(
    page.getByRole("checkbox", { name: "选择Colour Riche 缎光唇膏" }),
  ).toBeChecked();
});

test("刷新产品页后按钮与已保存的清单状态一致", async ({ page }) => {
  await page.goto("/products/colour-riche?story=color-of-freedom");
  await page.getByRole("button", { name: "加入妆容清单", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "✓ 已加入妆容清单", exact: true }),
  ).toBeVisible();
});

test("切换展墙后筛选仍可见且可清除", async ({ page }) => {
  await page.goto("/stories?view=list&q=爵士");
  await page.getByRole("button", { name: "展墙浏览", exact: true }).click();
  await expect(
    page.getByText("当前筛选：关键词「爵士」", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveCount(2);
  await page.getByRole("button", { name: "清除筛选", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(8);
});

test("直接打开产品不伪造故事来源", async ({ page }) => {
  await page.goto("/products/colour-riche?story=missing");
  await expect(page.locator("main")).not.toContainText(
    "来自「温柔，也有自己的力量」",
  );
  await page.getByRole("button", { name: "加入妆容清单", exact: true }).click();
  await page.getByRole("link", { name: "查看妆容清单 →" }).click();
  await expect(
    page.getByRole("link", { name: "← 返回故事展览" }),
  ).toHaveAttribute("href", "/stories");
});

test("手机展墙的长关键词不会撑出屏幕", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/stories?view=wall&q=" + "music".repeat(20));
  await expect(
    page.getByRole("button", { name: "清除筛选", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "清除筛选", exact: true }).click();
  await expect(page.locator("article")).toHaveCount(8);
});
