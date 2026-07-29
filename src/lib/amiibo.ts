import { readFileSync } from "fs";
import { join } from "path";

const SERIES_NAMES: Record<number, string> = {
  0x00: "Super Smash Bros.",
  0x01: "Super Mario",
  0x02: "Other",
  0x03: "Yoshi's Woolly World",
  0x04: "Splatoon",
  0x05: "Animal Crossing",
  0x06: "Super Mario (Special)",
  0x07: "Skylanders",
  0x09: "The Legend of Zelda",
  0x0a: "Shovel Knight",
  0x0c: "Kirby",
  0x0d: "Pokémon",
  0x0e: "Mario Sports Superstars",
  0x0f: "Monster Hunter Rise",
  0x10: "BoxBoy!",
  0x11: "Pikmin",
  0x12: "Fire Emblem",
  0x13: "Metroid",
  0x14: "Special Edition",
  0x15: "Mega Man",
  0x16: "Diablo",
  0x17: "Power Pro Baseball",
  0x18: "Monster Hunter",
  0x19: "Yu-Gi-Oh! Rush Duel",
  0x1a: "Donkey Kong Bananza",
  0x1b: "Xenoblade Chronicles",
  0x1c: "My Nintendo",
  0x1d: "Street Fighter 6",
  0x1e: "Kirby (Planet Robobot)",
  0x21: "Other",
  0xff: "Power Up Band",
};

const CARD_SERIES = new Set([0x05, 0x0e, 0x17, 0x19, 0x1d]);

export interface AmiiboRelease {
  au?: string;
  na?: string;
  eu?: string;
  jp?: string;
}

export interface Amiibo {
  id: string;
  name: string;
  release: AmiiboRelease;
  series: string;
  seriesId: number;
  figureType: "Figure" | "Card" | "Yarn";
  imageFilename: string;
}

export interface AmiiboUsage {
  Usage: string;
  write: boolean;
}

export interface GameEntry {
  gameName: string;
  gameID: string[];
  amiiboUsage: AmiiboUsage[];
}

export interface AmiiboGames {
  games3DS: GameEntry[];
  gamesWiiU: GameEntry[];
  gamesSwitch: GameEntry[];
  gamesSwitch2: GameEntry[];
}

function parseId(hexId: string): {
  seriesId: number;
  byte4: number;
  high: string;
  low: string;
} {
  const num = BigInt(hexId);
  const bytes: number[] = [];
  for (let i = 7; i >= 0; i--) {
    bytes[7 - i] = Number((num >> BigInt(i * 8)) & BigInt(0xff));
  }
  const high = bytes
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const low = bytes
    .slice(4, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { seriesId: bytes[6], byte4: bytes[4], high, low };
}

function getFigureType(
  name: string,
  seriesId: number,
  byte4: number
): "Figure" | "Card" | "Yarn" {
  if (byte4 === 0x02 || name.toLowerCase().includes("yarn")) return "Yarn";
  if (CARD_SERIES.has(seriesId)) return "Card";
  return "Figure";
}

let _amiiboCache: Amiibo[] | null = null;
let _gamesCache: Record<string, AmiiboGames> | null = null;

export function getAllAmiibos(): Amiibo[] {
  if (_amiiboCache) return _amiiboCache;
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "_data", "amiibo.json"), "utf-8")
  ) as { amiibos: Record<string, { name: string; release: AmiiboRelease }> };

  _amiiboCache = Object.entries(raw.amiibos).map(([id, data]) => {
    const { seriesId, byte4, high, low } = parseId(id);
    const series = SERIES_NAMES[seriesId] ?? `Series 0x${seriesId.toString(16).padStart(2, "0")}`;
    return {
      id,
      name: data.name,
      release: data.release,
      series,
      seriesId,
      figureType: getFigureType(data.name, seriesId, byte4),
      imageFilename: `icon_${high}-${low}.png`,
    };
  });

  _amiiboCache.sort((a, b) => a.name.localeCompare(b.name));
  return _amiiboCache;
}

export function getAmiiboById(id: string): Amiibo | undefined {
  return getAllAmiibos().find((a) => a.id === id);
}

export function getAllGamesInfo(): Record<string, AmiiboGames> {
  if (_gamesCache) return _gamesCache;
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "database", "games_info.json"), "utf-8")
  ) as {
    amiibos: Record<
      string,
      {
        games3DS?: GameEntry[];
        gamesWiiU?: GameEntry[];
        gamesSwitch?: GameEntry[];
        gamesSwitch2?: GameEntry[];
      }
    >;
  };

  _gamesCache = {};
  for (const [id, data] of Object.entries(raw.amiibos)) {
    _gamesCache[id] = {
      games3DS: data.games3DS ?? [],
      gamesWiiU: data.gamesWiiU ?? [],
      gamesSwitch: data.gamesSwitch ?? [],
      gamesSwitch2: data.gamesSwitch2 ?? [],
    };
  }
  return _gamesCache;
}

export function getGamesForAmiibo(id: string): AmiiboGames {
  const all = getAllGamesInfo();
  return (
    all[id] ?? { games3DS: [], gamesWiiU: [], gamesSwitch: [], gamesSwitch2: [] }
  );
}

export function getAllSeries(): string[] {
  const amiibos = getAllAmiibos();
  return [...new Set(amiibos.map((a) => a.series))].sort();
}

export function getEarliestRelease(release: AmiiboRelease): string | undefined {
  const dates = [release.na, release.eu, release.jp, release.au].filter(
    Boolean
  ) as string[];
  if (dates.length === 0) return undefined;
  return dates.sort()[0];
}
