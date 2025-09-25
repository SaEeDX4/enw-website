import React from 'react';
import styles from './StatCard.module.css';

function StatCard({ number, label, description, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.number}>{number}</div>
      <div className={styles.label}>{label}</div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
export default StatCard;
