import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className="container">
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Connecting Neighbors, Caring for Our Elderly
            </h1>
            <p className={styles.heroDescription}>
              ENW helps seniors with companionship, errands, and small tasks —
              free and local.
            </p>
            <div className={styles.heroActions}>
              <a href="/seniors" className={styles.primaryButton}>
                Get Support
              </a>
              <a href="/volunteers" className={styles.secondaryButton}>
                Become a Volunteer
              </a>
            </div>
          </div>
        </section>

        {/* QUICK INFO CARDS */}
        <section className={styles.quickInfo}>
          {/* optional visible section heading */}
          <h2 className={styles.sectionHeading}>
            How ENW Supports the Community
          </h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardHeading}>For Seniors</h3>
              <p>Friendly help with everyday needs and staying connected.</p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.cardHeading}>For Volunteers</h3>
              <p>Make a real difference in your neighborhood.</p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.cardHeading}>For Community</h3>
              <p>Stronger, kinder streets through simple support.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
