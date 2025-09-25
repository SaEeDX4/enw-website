import React from 'react';
import styles from './CTASection.module.css';

function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className = '',
}) {
  return (
    <section className={`${styles.ctaSection} ${styles[variant]} ${className}`}>
      <div className="container">
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
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
        </div>
      </div>
    </section>
  );
}
export default CTASection;
