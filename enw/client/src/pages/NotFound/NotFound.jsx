import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className="container">
        <h1 className={styles.title}>404</h1>
        <p className={styles.p}>The page you’re looking for doesn’t exist.</p>
        <Link to="/" className={styles.btn}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
