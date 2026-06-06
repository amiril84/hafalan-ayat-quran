import {
  createRangeAudioSlug,
  defaultRangeAudioBaseUrl,
  getRangeAudioObjectKey,
  getRangeAudioUrl,
  getSudaisAudioUrl,
} from "./audio-urls";
import { thematicVerseFixtures } from "./quran.fixtures";

describe("audio urls", () => {
  it("builds stable R2 object keys for thematic ranges", () => {
    const baqarah = thematicVerseFixtures.find(
      (verse) => verse.id === "2-284-286",
    );

    expect(baqarah).toBeDefined();
    expect(createRangeAudioSlug(baqarah!)).toBe("baqarah");
    expect(getRangeAudioObjectKey(baqarah!)).toBe("ranges/baqarah-284-286.mp3");
  });

  it("builds public R2 URLs for range audio", () => {
    const baqarah = thematicVerseFixtures.find(
      (verse) => verse.id === "2-183-188",
    );

    expect(baqarah).toBeDefined();
    expect(getRangeAudioUrl(baqarah!)).toBe(
      `${defaultRangeAudioBaseUrl}/ranges/baqarah-183-188.mp3`,
    );
  });

  it("builds public Sudais URLs for single ayah audio", () => {
    expect(getSudaisAudioUrl(2, 183)).toBe(
      "https://cdn.equran.id/audio-partial/Abdurrahman-as-Sudais/002183.mp3",
    );
  });
});
