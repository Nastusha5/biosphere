
"use client";

import { useEffect, useState } from 'react';
import styles from './progress-tracker.module.css';

const ecosystems = [
  { id: 'desert', name: 'Пустеля' },
  { id: 'savannah', name: 'Савана' },
  { id: 'ocean', name: 'Океан' },
  { id: 'tropical-forests', name: 'Тропічні ліси' },
  { id: 'swamp', name: 'Болото' },
  { id: 'agroecosystem', name: 'Агроекосистема' },
];

const WinnerBadge = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [progress]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={styles.winnerBadgeContainer}>
      <svg className={styles.progressRing} viewBox="0 0 100 100">
        <circle className={styles.progressRingBg} cx="50" cy="50" r="45" />
        <circle
          className={styles.progressRingFg}
          cx="50"
          cy="50"
          r="45"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <img
        src="/progress/winner.png"
        alt="Winner"
        width={80}
        height={80}
        className={styles.winnerImage}
        style={{ 
          filter: `grayscale(${1 - animatedProgress / 100})`,
        }}
      />
    </div>
  );
};

const EcosystemBadge = ({ id, name, completed, animationClass, delay }) => (
  <div 
    className={`${styles.ecosystemBadge} ${animationClass}`}
    style={{ animationDelay: delay }}
  >
    <img
      src={`/progress/${id}.png`}
      alt={name}
      width={72}
      height={72}
      className={`${styles.ecosystemImage} ${!completed ? styles.grayscale : ''}`}
    />
  </div>
);

export function ProgressTracker({ completedEcosystems }) {
  const leftEcosystems = [ecosystems[2], ecosystems[1], ecosystems[0]];
  const rightEcosystems = [ecosystems[3], ecosystems[4], ecosystems[5]];
  const totalCompleted = completedEcosystems.length;
  const overallProgress = (totalCompleted / ecosystems.length) * 100;

  return (
    <div className={styles.progressTrackerContainer}>
      <div className={styles.ecosystemGroup}>
        {leftEcosystems.map((eco, index) => (
          <EcosystemBadge
            key={eco.id}
            id={eco.id}
            name={eco.name}
            completed={completedEcosystems.includes(eco.id)}
            animationClass={styles.animateEcoRight}
            delay={`${1.4 - index * 0.2}s`}
          />
        ))}
      </div>
      <WinnerBadge progress={overallProgress} />
      <div className={styles.ecosystemGroup}>
        {rightEcosystems.map((eco, index) => (
          <EcosystemBadge
            key={eco.id}
            id={eco.id}
            name={eco.name}
            completed={completedEcosystems.includes(eco.id)}
            animationClass={styles.animateEcoLeft}
            delay={`${1 + index * 0.2}s`}
          />
        ))}
      </div>
    </div>
  );
}
