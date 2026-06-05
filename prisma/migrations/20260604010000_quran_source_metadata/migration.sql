ALTER TABLE "ayahs"
ADD COLUMN "translationSource" TEXT NOT NULL DEFAULT 'Fixture Dummy',
ADD COLUMN "translationSourceUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN "providerMetadata" JSONB;

ALTER TABLE "tafsirs"
ADD COLUMN "tafsirSourceUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN "providerMetadata" JSONB;

ALTER TABLE "audios"
ADD COLUMN "audioSource" TEXT NOT NULL DEFAULT 'Fixture Dummy',
ADD COLUMN "audioSourceUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN "providerMetadata" JSONB;
