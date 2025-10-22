
import styles from './text-tab.module.css';

export function TextTab({ content, funFact, onProceed, canProceed }) {
    return (
        <div className={styles.scrollArea}>
            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    {content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                
                <div className={styles.funFactContainer}>
                    <h3 className={styles.funFactTitle}>Цікаво знати. {funFact.title}</h3>
                    <div className={styles.funFactContent}>
                        {funFact.content.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <button onClick={onProceed} disabled={!canProceed} className={styles.button}>
                    Перейти до тесту
                </button>
            </div>
        </div>
    );
}
