import React from 'react';
import styles from './Hero.module.css';

function Hero({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className = '',
}) {
  return (
    <section className={`${styles.hero} ${styles[variant]} ${className}`}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {(primaryAction || secondaryAction) && (
            <div className={styles.actions}>
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  className={styles.primaryButton}
                  aria-label={primaryAction.ariaLabel}
                >
                  {primaryAction.text}
                </a>
              )}
              {secondaryAction && (
                <a
                  href={secondaryAction.href}
                  className={styles.secondaryButton}
                  aria-label={secondaryAction.ariaLabel}
                >
                  {secondaryAction.text}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
export default Hero;
