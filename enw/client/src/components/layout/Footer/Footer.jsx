import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.main}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>Elderly Neighbour Watch</h2>
            <p className={styles.desc}>
              Connecting volunteers with elderly neighbors for free community
              support.
            </p>
          </div>

          <div className={styles.nav}>
            <div>
              <h3 className={styles.h}>Get Involved</h3>
              <ul className={styles.links}>
                <li>
                  <Link to="/seniors">For Seniors</Link>
                </li>
                <li>
                  <Link to="/volunteers">For Volunteers</Link>
                </li>
                <li>
                  <Link to="/partners">For Partners</Link>
                </li>
                <li>
                  <Link to="/support-us">Support Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.h}>Learn More</h3>
              <ul className={styles.links}>
                <li>
                  <Link to="/how-it-works">How It Works</Link>
                </li>
                <li>
                  <Link to="/news">News & Updates</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {year} ENW</p>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
