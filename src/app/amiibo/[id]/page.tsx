import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllAmiibos,
  getAmiiboById,
  getGamesForAmiibo,
} from "@/lib/amiibo";
import Header from "@/components/Header/Header";
import GamesList from "@/components/GamesList/GamesList";
import styles from "./page.module.css";
import { withBasePath } from "@/lib/withBasePath";

export async function generateStaticParams() {
  return getAllAmiibos().map((a) => ({ id: encodeURIComponent(a.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const amiibo = getAmiiboById(decodeURIComponent(id));
  if (!amiibo) return { title: "Amiibo Not Found" };
  return { title: `${amiibo.name} — Amiibo Database` };
}

const REGIONS = [
  { key: "na" as const, label: "North America" },
  { key: "eu" as const, label: "Europe" },
  { key: "jp" as const, label: "Japan" },
  { key: "au" as const, label: "Australia" },
];

export default async function AmiiboDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const amiibo = getAmiiboById(decodeURIComponent(id));
  if (!amiibo) notFound();

  const games = getGamesForAmiibo(amiibo.id);
  const totalGames =
    games.games3DS.length +
    games.gamesWiiU.length +
    games.gamesSwitch.length +
    games.gamesSwitch2.length;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadLink}>
            ← Back to Browse
          </Link>
        </div>

        <div className={styles.detailWrap}>
          <div className={styles.sidebar}>
            <div className={styles.imageCard}>
              <img
                src={withBasePath(`/images/${amiibo.imageFilename}`)}
                alt={amiibo.name}
                className={styles.image}
                width={300}
                height={300}
              />
            </div>

            <div className={styles.infoCard}>
              <h1 className={styles.name}>{amiibo.name}</h1>
              <p className={styles.series}>{amiibo.series}</p>

              <div className={styles.badges}>
                <span
                  className={`${styles.badge} ${
                    amiibo.figureType === "Card"
                      ? styles.badgeCard
                      : amiibo.figureType === "Yarn"
                        ? styles.badgeYarn
                        : styles.badgeFigure
                  }`}
                >
                  {amiibo.figureType}
                </span>
                <span className={styles.badgeGames}>
                  {totalGames} compatible game{totalGames !== 1 ? "s" : ""}
                </span>
              </div>

              <div className={styles.releaseSection}>
                <h2 className={styles.sectionLabel}>Release Dates</h2>
                <dl className={styles.releaseGrid}>
                  {REGIONS.map(({ key, label }) =>
                    amiibo.release[key] ? (
                      <div key={key} className={styles.releaseItem}>
                        <dt className={styles.releaseRegion}>{label}</dt>
                        <dd className={styles.releaseDate}>
                          {new Date(amiibo.release[key]!).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </dd>
                      </div>
                    ) : null
                  )}
                </dl>
              </div>

              <div className={styles.idRow}>
                <span className={styles.idLabel}>Amiibo ID</span>
                <code className={styles.idValue}>
                  {amiibo.id.slice(2).toUpperCase()}
                </code>
              </div>
            </div>
          </div>

          <div className={styles.gamesSection}>
            <h2 className={styles.gamesSectionTitle}>Game Compatibility</h2>
            <GamesList games={games} />
          </div>
        </div>
      </main>
    </>
  );
}
