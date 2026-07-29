import { getAllAmiibos, getAllSeries } from "@/lib/amiibo";
import Header from "@/components/Header/Header";
import AmiiboGallery from "@/components/AmiiboGallery/AmiiboGallery";
import styles from "./page.module.css";

export default function HomePage() {
  const amiibos = getAllAmiibos();
  const allSeries = getAllSeries();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Amiibo Database</h1>
          <p className={styles.heroSub}>
            Browse {amiibos.length} amiibo figures, cards &amp; yarn with game
            compatibility info.
          </p>
        </div>
        <div className={styles.content}>
          <AmiiboGallery amiibos={amiibos} allSeries={allSeries} />
        </div>
      </main>
    </>
  );
}
