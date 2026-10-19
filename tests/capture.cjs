const { chromium } = require("@playwright/test");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage({
    viewport: { width: 1512, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  fs.mkdirSync("screenshots", { recursive: true });
  for (const [name, path] of [
    ["home", "/"],
    ["gallery", "/stories"],
    ["detail", "/stories/gentle-strength"],
    ["product", "/products/colour-riche"],
    ["selection", "/selection"],
  ]) {
    await page.goto("http://localhost:3000" + path);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(650);
    await page.screenshot({
      path: `screenshots/${name}-desktop.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/stories");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "screenshots/gallery-mobile.png",
    fullPage: true,
  });
  console.log(JSON.stringify({ errors }));
  await browser.close();
})();
