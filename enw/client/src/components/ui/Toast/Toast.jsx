import React, { useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import styles from './Toast.module.css';

function Toast() {
  const { state, actions } = useAppContext();
  const { notifications } = state;

  useEffect(() => {
    // Auto-dismiss notifications after 5 seconds
    notifications.forEach((notification) => {
      if (!notification.persist) {
        setTimeout(() => {
          actions.removeNotification(notification.id);
        }, 5000);
      }
    });
  }, [notifications, actions]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.toastContainer}
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.toast} ${styles[notification.type || 'info']}`}
          role="alert"
        >
          <div className={styles.content}>
            {notification.title && (
              <div className={styles.title}>{notification.title}</div>
            )}
            <div className={styles.message}>{notification.message}</div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => actions.removeNotification(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
