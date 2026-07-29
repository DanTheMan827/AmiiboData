import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎮</span>
          <span className={styles.logoText}>
            Amiibo <strong>Database</strong>
          </span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Browse
          </Link>
          <Link href="/games" className={styles.navLink}>
            Games
          </Link>
        </nav>
      </div>
    </header>
  );
}
