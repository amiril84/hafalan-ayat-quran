import type { Metadata } from "next";
import { ThematicVerseList } from "@/components/thematic-verse-list";

export const metadata: Metadata = {
  title: "Daftar Ayat Tematik",
  description:
    "Daftar 24 ayat tematik Al Quran untuk latihan hafalan, lengkap dengan pencarian, detail ayat, tafsir, dan audio.",
};

export default function Home() {
  return <ThematicVerseList />;
}
