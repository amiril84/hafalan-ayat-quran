import { expect, test, type Page } from "@playwright/test";

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

async function waitForHomeBackend(page: Page) {
  await expect(
    page.getByText("Mengambil ayat tematik dari backend."),
  ).toBeHidden({ timeout: 30_000 });
}

async function waitForDetailBackend(page: Page) {
  await expect(
    page.getByText("Mengambil detail ayat dari backend."),
  ).toBeHidden({ timeout: 30_000 });
}

test("loads the home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Hafalan ayat tematik Al Quran" }),
  ).toBeVisible();
  await expect(page.getByTestId("verse-card")).toHaveCount(24);
});

test("sorts cards by mushaf order and ayah start", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.getByTestId("verse-card").first();

  await expect(firstCard).toContainText("Al Baqarah");
  await expect(firstCard).toContainText("Ayat 168 - 173");
});

test("filters cards by surah and theme, then shows empty state", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Cari ayat" }).click();
  const searchInput = page.getByLabel("Cari berdasarkan nama surat atau tema");
  await expect(searchInput).toBeVisible();

  await searchInput.fill("baqarah");
  await expect(page.getByTestId("verse-card")).toHaveCount(4);

  await searchInput.fill("puasa");
  await expect(page.getByTestId("verse-card")).toHaveCount(1);
  await expect(page.getByText("Puasa dan ketakwaan")).toBeVisible();

  await searchInput.fill("query tidak cocok");
  await expect(page.getByTestId("verse-card")).toHaveCount(0);
  await expect(page.getByText("Tidak ada ayat ditemukan")).toBeVisible();
});

test("plays mock audio state from a card", async ({ page }) => {
  await page.goto("/");
  await waitForHomeBackend(page);

  const firstCard = page.getByTestId("verse-card").first();
  await firstCard
    .getByRole("button", {
      name: "Dengarkan Al Baqarah ayat 168 sampai 173",
    })
    .click();

  await expect(firstCard.getByText("Memutar semua")).toBeVisible();
});

test("opens the stable detail route from a card", async ({ page }) => {
  await page.goto("/");
  await waitForHomeBackend(page);

  const detailLink = page.getByTestId("verse-card").first().getByRole("link", {
    name: "Lihat detail Al Baqarah ayat 168 sampai 173",
  });

  await expect(detailLink).toHaveAttribute("href", "/ayat/2/168-173");
  await Promise.all([
    page.waitForURL(/\/ayat\/2\/168-173$/),
    detailLink.click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Al Baqarah ayat 168 - 173" }),
  ).toBeVisible();
});

test("opens detail, plays range and ayah audio, then opens tafsir", async ({
  page,
}) => {
  test.setTimeout(60_000);

  await page.goto("/");
  await waitForHomeBackend(page);

  const detailLink = page
    .getByTestId("verse-card")
    .filter({ hasText: "Puasa dan ketakwaan" })
    .getByRole("link", {
      name: "Lihat detail Al Baqarah ayat 183 sampai 188",
    });

  await Promise.all([
    page.waitForURL(/\/ayat\/2\/183-188$/),
    detailLink.click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Al Baqarah ayat 183 - 188" }),
  ).toBeVisible();
  await expect(page.getByText("Puasa dan ketakwaan")).toBeVisible();
  await waitForDetailBackend(page);
  await expect(page.getByTestId("ayah-list-item")).toHaveCount(6);

  await page
    .getByRole("button", {
      name: "Dengarkan Al Baqarah ayat 183 sampai 188",
    })
    .click();
  await expect(page.getByText("Memutar semua")).toBeVisible();

  const firstAyah = page.getByTestId("ayah-list-item").first();
  await firstAyah
    .getByRole("button", { name: "Dengarkan Al Baqarah ayat 183" })
    .click();
  await expect(firstAyah.getByText("Memutar ayat")).toBeVisible();

  const tafsirLink = firstAyah.getByRole("link", {
    name: "Buka tafsir Al Baqarah ayat 183",
  });
  await expect(tafsirLink).toHaveAttribute("href", "/tafsir/2/183");
  await page.goto("/tafsir/2/183");
  await expect(page).toHaveURL(/\/tafsir\/2\/183$/);

  await expect(
    page.getByRole("heading", { name: "Al Baqarah:183" }),
  ).toBeVisible();
  await expect(page.getByText("Sumber: Tafsir Kemenag RI")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tafsir singkat" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Kembali ke detail" }),
  ).toHaveAttribute("href", "/ayat/2/183-188");
  await page.goto("/ayat/2/183-188");
  await expect(page).toHaveURL(/\/ayat\/2\/183-188$/);
  await expect(
    page.getByRole("heading", { name: "Al Baqarah ayat 183 - 188" }),
  ).toBeVisible();
});

for (const viewport of [
  { name: "detail mobile", width: 390, height: 844 },
  { name: "detail desktop", width: 1440, height: 900 },
]) {
  test(`renders ${viewport.name} without overlap smoke`, async ({ page }) => {
    test.setTimeout(60_000);

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/ayat/2/183-188");

    await expect(
      page.getByRole("heading", { name: "Al Baqarah ayat 183 - 188" }),
    ).toBeVisible();
    await waitForDetailBackend(page);
    await expect(page.getByTestId("ayah-list-item")).toHaveCount(6);

    const screenshot = await page.screenshot();
    expect(screenshot.length).toBeGreaterThan(1000);
  });
}

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`renders cleanly on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Hafalan ayat tematik Al Quran" }),
    ).toBeVisible();
    await expect(page.getByTestId("verse-card")).toHaveCount(24);
    await expect(page.getByTestId("verse-card").first()).toBeVisible();
  });
}
