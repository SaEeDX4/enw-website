import React from 'react';
import styles from './FeatureList.module.css';

function FeatureList({ title, features, columns = 3 }) {
  return (
    <section className={styles.featureList}>
      <div className="container">
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={`${styles.grid} ${styles[`cols${columns}`]}`}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.feature}>
              {feature.icon && (
                <div className={styles.iconWrapper} aria-hidden="true">
                  {feature.icon}
                </div>
              )}
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FeatureList;
