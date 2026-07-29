import type { Metadata } from "next";
import { getAllGamesInfo } from "@/lib/amiibo";
import Header from "@/components/Header/Header";
import GamesGallery, {
  type GameSummary,
} from "@/components/GamesGallery/GamesGallery";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Games — Amiibo Database",
  description: "Browse all games with amiibo compatibility across Switch, Wii U and 3DS.",
};

function buildGamesSummary(): GameSummary[] {
  const gamesInfo = getAllGamesInfo();
  const gameMap = new Map<
    string,
    { platforms: Set<string>; amiiboIds: Set<string> }
  >();

  for (const [amiiboId, data] of Object.entries(gamesInfo)) {
    const platforms = [
      "gamesSwitch2",
      "gamesSwitch",
      "gamesWiiU",
      "games3DS",
    ] as const;
    for (const platform of platforms) {
      for (const game of data[platform]) {
        if (!gameMap.has(game.gameName)) {
          gameMap.set(game.gameName, {
            platforms: new Set(),
            amiiboIds: new Set(),
          });
        }
        const entry = gameMap.get(game.gameName)!;
        entry.platforms.add(platform);
        entry.amiiboIds.add(amiiboId);
      }
    }
  }

  return Array.from(gameMap.entries())
    .map(([name, { platforms, amiiboIds }]) => ({
      name,
      platforms: Array.from(platforms),
      amiiboCount: amiiboIds.size,
      amiiboIds: Array.from(amiiboIds),
    }))
    .sort((a, b) => b.amiiboCount - a.amiiboCount);
}

export default function GamesPage() {
  const games = buildGamesSummary();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Game Compatibility</h1>
          <p className={styles.heroSub}>
            {games.length} games across Nintendo Switch, Wii U, and 3DS.
          </p>
        </div>
        <div className={styles.content}>
          <GamesGallery games={games} />
        </div>
      </main>
    </>
  );
}
