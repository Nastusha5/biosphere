import React, { useState, useEffect, useMemo } from 'react';
import styles from './Particles.module.css';

const Particles = ({ className, quantity = 150 }) => {
  const particles = useMemo(() => {
    const newParticles = [];
    for (let i = 0; i < quantity; i++) {
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -35;
      const left = Math.random() * 100;

      newParticles.push({
        id: i,
        style: {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--delay': `${delay}s`,
          '--left': `${left}%`,
        },
      });
    }
    return newParticles;
  }, [quantity]);

  return (
    <div className={`${styles.particleContainer} ${className || ''}`}>
      {particles.map((p) => (
        <div key={p.id} className={styles.particle} style={p.style} />
      ))}
    </div>
  );
};

export default Particles;
