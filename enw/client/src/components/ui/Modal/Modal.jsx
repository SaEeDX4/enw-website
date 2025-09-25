import React, { useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({
  open,
  title,
  children,
  onClose,
  size = 'md',
  closeLabel = 'Close',
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`${styles.modal} ${styles[size]}`}>
        <div className={styles.header}>
          {title && (
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
          )}
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={closeLabel}
          >
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
      <button
        type="button"
        className={styles.scrim}
        aria-hidden="true"
        onClick={onClose}
      />
    </div>
  );
}

export default Modal;
