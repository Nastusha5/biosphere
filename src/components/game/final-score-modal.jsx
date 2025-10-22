
import styles from './final-score-modal.module.css';

export function FinalScoreModal({ isOpen, testScore, practicalScore, onClose }) {
    if (!isOpen) return null;

    const totalScore = (testScore || 0) + (practicalScore || 0);

    return (
        <div className={styles.dialogOverlay}>
            <div className={styles.dialogContent}>
                <div className={styles.dialogHeader}>
                    <h2 className={styles.dialogTitle}>Екосистему пройдено!</h2>
                    <p className={styles.dialogDescription}>Чудова робота! Ось твої результати:</p>
                </div>
                <div className={styles.scoresContainer}>
                    <div className={styles.scoreItem}>
                        Бал за тест: <span className={styles.score}>{testScore || 0}</span>
                    </div>
                    <div className={styles.scoreItem}>
                        Бал за практику: <span className={styles.score}>{practicalScore || 0}</span>
                    </div>
                    <hr className={styles.separator} />
                    <div className={styles.totalScore}>
                        Загальний бал: <span className={styles.score}>{totalScore.toFixed(1)}</span>
                    </div>
                </div>
                <div className={styles.dialogFooter}>
                    <button onClick={onClose} className={styles.button}>Продовжити</button>
                </div>
            </div>
        </div>
    );
};
