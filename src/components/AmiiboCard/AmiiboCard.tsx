import Link from "next/link";
import type { Amiibo } from "@/lib/amiibo";
import styles from "./AmiiboCard.module.css";

interface Props {
  amiibo: Amiibo;
}

const TYPE_CLASS: Record<string, string> = {
  Figure: styles.tagFigure,
  Card: styles.tagCard,
  Yarn: styles.tagYarn,
};

export default function AmiiboCard({ amiibo }: Props) {
  const naDate = amiibo.release.na;
  const releaseYear = naDate
    ? naDate.slice(0, 4)
    : amiibo.release.jp?.slice(0, 4) ??
      amiibo.release.eu?.slice(0, 4) ??
      amiibo.release.au?.slice(0, 4);

  return (
    <Link href={`/amiibo/${encodeURIComponent(amiibo.id)}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={`/images/${amiibo.imageFilename}`}
          alt={amiibo.name}
          loading="lazy"
          className={styles.image}
          width={200}
          height={200}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name} title={amiibo.name}>
          {amiibo.name}
        </h3>
        <p className={styles.series} title={amiibo.series}>
          {amiibo.series}
        </p>
        <div className={styles.footer}>
          <span className={`${styles.tag} ${TYPE_CLASS[amiibo.figureType] ?? styles.tagFigure}`}>
            {amiibo.figureType}
          </span>
          {releaseYear && (
            <span className={styles.year}>{releaseYear}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
