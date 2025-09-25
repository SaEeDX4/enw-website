import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'For Seniors', href: '/seniors' },
    { name: 'For Volunteers', href: '/volunteers' },
    { name: 'Partners', href: '/partners' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
            ENW
          </Link>

          <nav className={styles.desktop} aria-label="Main">
            <ul className={styles.list}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={styles.link}
                    aria-current={
                      location.pathname === item.href ? 'page' : undefined
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.ctaWrap}>
            <Link to="/support-us" className={styles.cta}>
              Support Us
            </Link>
            <button
              className={styles.menuBtn}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">
                {open ? 'Close menu' : 'Open menu'}
              </span>
              <div className={styles.ham}>
                <span />
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" className={styles.mobile} aria-label="Mobile">
            <ul className={styles.mobileList}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={styles.mobileLink}
                    aria-current={
                      location.pathname === item.href ? 'page' : undefined
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/support-us"
                  className={styles.mobileCta}
                  onClick={() => setOpen(false)}
                >
                  Support Us
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
