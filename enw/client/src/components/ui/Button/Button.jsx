import React from 'react';
import styles from './Button.module.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]} 
        ${loading ? styles.loading : ''} 
        ${className}
      `}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true"></span>}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </button>
  );
}

export default Button;
