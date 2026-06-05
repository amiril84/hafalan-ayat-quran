import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const checkedPages = [
  { path: "/", heading: "Hafalan ayat tematik Al Quran" },
  { path: "/ayat/2/183-188", heading: "Al Baqarah ayat 183 - 188" },
  { path: "/tafsir/2/183", heading: "Al Baqarah:183" },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: () => Promise.resolve(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: () => undefined,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: () => undefined,
    });
  });
});

async function tabUntilFocused(page: Page, locator: Locator, maxTabs = 8) {
  for (let tabIndex = 0; tabIndex < maxTabs; tabIndex += 1) {
    if (await locator.evaluate((node) => node === document.activeElement)) {
      return;
    }

    await page.keyboard.press("Tab");
  }

  await expect(locator).toBeFocused();
}

for (const checkedPage of checkedPages) {
  test(`has no critical accessibility violations on ${checkedPage.path}`, async ({
    page,
  }) => {
    await page.goto(checkedPage.path);
    await expect(
      page.getByRole("heading", { name: checkedPage.heading }),
    ).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const seriousViolations = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );

    expect(seriousViolations).toEqual([]);
  });
}

test("supports keyboard navigation through search, detail, audio, tafsir, and back", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Cari ayat" })).toBeFocused();
  await page.keyboard.press("Enter");

  const searchInput = page.getByLabel("Cari berdasarkan nama surat atau tema");
  await expect(searchInput).toBeFocused();
  await searchInput.fill("puasa");
  await expect(page.getByTestId("verse-card")).toHaveCount(1);

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", {
      name: "Dengarkan Al Baqarah ayat 183 sampai 188",
    }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Memutar semua")).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", {
      name: "Lihat detail Al Baqarah ayat 183 sampai 188",
    }),
  ).toBeFocused();
  await Promise.all([
    page.waitForURL(/\/ayat\/2\/183-188$/),
    page.keyboard.press("Enter"),
  ]);

  await expect(
    page.getByRole("heading", { name: "Al Baqarah ayat 183 - 188" }),
  ).toBeVisible();
  await tabUntilFocused(
    page,
    page.getByRole("link", { name: "Kembali ke daftar" }),
  );

  await tabUntilFocused(
    page,
    page.getByRole("button", {
      name: "Dengarkan Al Baqarah ayat 183 sampai 188",
    }),
  );

  await tabUntilFocused(
    page,
    page.getByRole("button", {
      name: "Dengarkan Al Baqarah ayat 183",
      exact: true,
    }),
  );

  await tabUntilFocused(
    page,
    page.getByRole("link", { name: "Buka tafsir Al Baqarah ayat 183" }),
  );
  await Promise.all([
    page.waitForURL(/\/tafsir\/2\/183$/),
    page.keyboard.press("Enter"),
  ]);

  await expect(
    page.getByRole("heading", { name: "Al Baqarah:183" }),
  ).toBeVisible();
  await tabUntilFocused(
    page,
    page.getByRole("link", { name: "Kembali ke detail" }),
  );
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`has stable readable layout on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");

    const firstCard = page.getByTestId("verse-card").first();
    const box = await firstCard.boundingBox();
    const arabicText = await firstCard.locator('[lang="ar"]').textContent();

    expect(box?.width).toBeGreaterThan(280);
    expect(arabicText).toMatch(/[\u0600-\u06ff]/);
    await expect(firstCard).toBeVisible();
  });
}

test("does not emit fatal console errors on core pages", async ({ page }) => {
  const fatalMessages: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      fatalMessages.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    fatalMessages.push(error.message);
  });

  for (const checkedPage of checkedPages) {
    await page.goto(checkedPage.path);
    await expect(
      page.getByRole("heading", { name: checkedPage.heading }),
    ).toBeVisible();
  }

  expect(fatalMessages).toEqual([]);
});
