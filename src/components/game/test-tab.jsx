
import { EcosystemTest } from './ecosystem-test';
import styles from './test-tab.module.css';

export function TestTab({ test, onComplete, isCompleted, isJustCompleted, onProceed, student, ecosystemId }) {
    return (
        <div className={styles.testContainer}>
            {test ? (
                <EcosystemTest 
                    test={test} 
                    onComplete={onComplete} 
                    isCompleted={isCompleted}
                    isJustCompleted={isJustCompleted}
                    ecosystemId={ecosystemId}
                    onProceed={onProceed}
                    student={student}
                />
            ) : (
                <div className={styles.noTest}>
                    <p>Тестове завдання буде додано найближчим часом.</p>
                </div>
            )}
        </div>
    );
}
