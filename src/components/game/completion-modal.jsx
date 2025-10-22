
import styles from './completion-modal.module.css';
import { useEffect } from 'react';

export function CompletionModal({ ecosystem, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.imageContainer}>
          <img src={ecosystem.icon} alt={ecosystem.name} width={150} height={150} className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>Вітаємо!</h2>
          <p className={styles.subtitle}>Ти опанував екосистему "{ecosystem.name}".</p>
        </div>
      </div>
    </div>
  );
}
