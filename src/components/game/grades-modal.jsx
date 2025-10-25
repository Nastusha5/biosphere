
'use client';

import styles from './grades-modal.module.css';
import * as AiIcons from 'react-icons/ai';

export function GradesModal({ isOpen, onClose, student, ecosystems }) {
    if (!isOpen) return null;

    const calculateTotalScore = () => {
        if (!student?.scores || ecosystems.length === 0) {
            return '0.0';
        }

        const totalSumOfScores = ecosystems.reduce((total, eco) => {
            const scores = student.scores[eco.id] || {};
            const testScore = scores.test || 0;
            const exerciseScore = scores.exercise || 0;
            return total + testScore + exerciseScore;
        }, 0);

        const average = totalSumOfScores / ecosystems.length;

        return average.toFixed(1);
    };

    return (
        <div className={styles.dialogOverlay}>
            <div className={styles.dialogContent}>
                <div className={styles.dialogHeader}>
                    <h2 className={styles.dialogTitle}>Підсумкові оцінки</h2>
                    <button onClick={onClose} className={styles.closeButton}><AiIcons.AiOutlineClose /></button>
                </div>
                <div className={styles.gradesContainer}>
                    <table className={styles.gradesTable}>
                        <thead>
                            <tr>
                                <th>Екосистема</th>
                                <th>Тест (бал)</th>
                                <th>Практика (бал)</th>
                                <th>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ecosystems.map(eco => {
                                const scores = student?.scores?.[eco.id] || {};
                                const testScore = scores.test || 0;
                                const exerciseScore = scores.exercise || 0;
                                const sum = testScore + exerciseScore;
                                const hasPractical = eco.id;

                                return (
                                    <tr key={eco.id}>
                                        <td>{eco.name}</td>
                                        <td>{testScore.toFixed(1)}</td>
                                        <td>{hasPractical ? exerciseScore.toFixed(1) : '—'}</td>
                                        <td>{sum.toFixed(1)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className={styles.totalScore}>
                        <strong>Загальний бал: {calculateTotalScore()}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
