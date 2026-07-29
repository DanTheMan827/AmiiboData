import type { AmiiboGames, GameEntry } from "@/lib/amiibo";
import styles from "./GamesList.module.css";

interface Props {
  games: AmiiboGames;
}

const PLATFORMS = [
  { key: "gamesSwitch2" as const, label: "Nintendo Switch 2" },
  { key: "gamesSwitch" as const, label: "Nintendo Switch" },
  { key: "gamesWiiU" as const, label: "Wii U" },
  { key: "games3DS" as const, label: "Nintendo 3DS" },
];

function GameRow({ game }: { game: GameEntry }) {
  return (
    <div className={styles.gameRow}>
      <p className={styles.gameName}>{game.gameName}</p>
      {game.amiiboUsage.map((u, i) => (
        <div key={i} className={styles.usage}>
          <span className={`${styles.badge} ${u.write ? styles.badgeWrite : styles.badgeRead}`}>
            {u.write ? "Read & Write" : "Read Only"}
          </span>
          <span className={styles.usageText}>{u.Usage}</span>
        </div>
      ))}
    </div>
  );
}

export default function GamesList({ games }: Props) {
  const hasAny = PLATFORMS.some((p) => games[p.key].length > 0);
  if (!hasAny) {
    return (
      <p className={styles.empty}>No game compatibility data available.</p>
    );
  }

  return (
    <div className={styles.wrap}>
      {PLATFORMS.map(({ key, label }) => {
        const list = games[key];
        if (list.length === 0) return null;
        return (
          <section key={key} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {label}
              <span className={styles.count}>{list.length}</span>
            </h2>
            <div className={styles.gameList}>
              {list.map((g, i) => (
                <GameRow key={i} game={g} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
