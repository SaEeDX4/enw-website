import React from 'react';
import styles from './TestimonialCard.module.css';

function TestimonialCard({ quote, author, location, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <blockquote className={styles.quote}>"{quote}"</blockquote>
      <div className={styles.author}>
        <cite className={styles.name}>{author}</cite>
        {location && <span className={styles.location}>{location}</span>}
      </div>
    </div>
  );
}
export default TestimonialCard;
