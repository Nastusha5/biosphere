
import { TrophicWebExercise } from './trophic-web-exercise';
import styles from './practical-tab.module.css';

export function PracticalTab({ exercise, onComplete, onEcosystemComplete, isCompleted, ecosystem }) {
    return (
        <div className={styles.practicalContainer}>
            <TrophicWebExercise 
                exercise={exercise} 
                onComplete={onComplete}
                onEcosystemComplete={onEcosystemComplete}
                isCompleted={isCompleted}
                ecosystem={ecosystem}
            />
        </div>
    );
}
