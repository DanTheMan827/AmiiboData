"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./GamesGallery.module.css";

export interface GameSummary {
  name: string;
  platforms: string[];
  amiiboCount: number;
  amiiboIds: string[];
}

interface Props {
  games: GameSummary[];
}

const PLATFORM_LABELS: Record<string, string> = {
  gamesSwitch2: "Switch 2",
  gamesSwitch: "Switch",
  gamesWiiU: "Wii U",
  games3DS: "3DS",
};

const PLATFORM_CLASS: Record<string, string> = {
  gamesSwitch2: styles.tagSwitch2,
  gamesSwitch: styles.tagSwitch,
  gamesWiiU: styles.tagWiiU,
  games3DS: styles.tag3DS,
};

export default function GamesGallery({ games }: Props) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [sortBy, setSortBy] = useState("count-desc");

  const filtered = useMemo(() => {
    let list = games;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((g) => g.name.toLowerCase().includes(q));
    }
    if (platform) {
      list = list.filter((g) => g.platforms.includes(platform));
    }
    const sorted = [...list];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "count-asc":
        sorted.sort((a, b) => a.amiiboCount - b.amiiboCount);
        break;
      default:
        sorted.sort((a, b) => b.amiiboCount - a.amiiboCount);
    }
    return sorted;
  }, [games, search, platform, sortBy]);

  return (
    <div>
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search games…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <select
          className={styles.select}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">All Platforms</option>
          {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="count-desc">Most Compatible</option>
          <option value="count-asc">Fewest Compatible</option>
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
        </select>
        <span className={styles.count}>
          {filtered.length} / {games.length} games
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>🎮</span>
          <p>No games found.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((game) => (
            <div key={game.name} className={styles.gameCard}>
              <div className={styles.gameInfo}>
                <h3 className={styles.gameName}>{game.name}</h3>
                <div className={styles.platformTags}>
                  {game.platforms.map((p) => (
                    <span
                      key={p}
                      className={`${styles.platformTag} ${PLATFORM_CLASS[p] ?? ""}`}
                    >
                      {PLATFORM_LABELS[p] ?? p}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.gameStats}>
                <span className={styles.amiiboCount}>
                  <strong>{game.amiiboCount}</strong>
                  <span>amiibo</span>
                </span>
                <div className={styles.amiiboPreview}>
                  {game.amiiboIds.slice(0, 6).map((id) => {
                    const high = id.slice(2, 10);
                    const low = id.slice(10, 18);
                    return (
                      <Link
                        key={id}
                        href={`/amiibo/${encodeURIComponent(id)}`}
                        className={styles.previewThumb}
                        title={id}
                      >
                        <img
                          src={`/images/icon_${high}-${low}.png`}
                          alt=""
                          loading="lazy"
                          width={36}
                          height={36}
                        />
                      </Link>
                    );
                  })}
                  {game.amiiboIds.length > 6 && (
                    <span className={styles.moreCount}>
                      +{game.amiiboIds.length - 6}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
