
"use client";

import { useState, useMemo } from 'react';
import styles from './trophic-web-exercise.module.css';
import { CompletionModal } from './completion-modal';
import { CustomSelect } from './custom-select';
import * as FaIcons from 'react-icons/fa';

const MAX_ATTEMPTS = 3;

const shuffleArray = (array) => {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

export function TrophicWebExercise({ exercise, onComplete, onEcosystemComplete, isCompleted, ecosystem, isReviewMode }) {
    const [userAnswers, setUserAnswers] = useState({});
    const [feedback, setFeedback] = useState({});
    const [attempts, setAttempts] = useState(0);
    const [showFinalResult, setShowFinalResult] = useState(isCompleted);
    const [finalScore, setFinalScore] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const handleSelectChange = (chainIndex, stepIndex, value) => {
        setUserAnswers(prev => ({ ...prev, [`${chainIndex}-${stepIndex}`]: value }));
    };

    const checkSolution = () => {
        const newFeedback = {};
        let correctCount = 0;

        exercise.chains.forEach((chain, chainIndex) => {
            chain.sequence.slice(1).forEach((correctOrganismId, stepIndex) => {
                const answerKey = `${chainIndex}-${stepIndex + 1}`;
                const userAnswer = userAnswers[answerKey];
                if (userAnswer === correctOrganismId) {
                    newFeedback[answerKey] = 'correct';
                    correctCount++;
                } else {
                    newFeedback[answerKey] = 'incorrect';
                }
            });
        });

        setFeedback(newFeedback);
        const currentAttempt = attempts + 1;
        setAttempts(currentAttempt);
        
        const isPerfect = correctCount === exercise.chains.reduce((acc, chain) => acc + chain.sequence.length - 1, 0);

        if (currentAttempt >= MAX_ATTEMPTS || isPerfect) {
            const score = isPerfect ? 3 : 0;
            setFinalScore(score);
            setShowFinalResult(true);
            onComplete(score);
            if (score > 0) { 
                setShowCompletionModal(true);
                if(onEcosystemComplete) {
                    onEcosystemComplete();
                }
            }
        }
    };

    const handleModalClose = () => {
        setShowCompletionModal(false);
    };

    const getOrganismById = (id) => exercise.organisms.find(o => o.id === id);

    const shuffledChains = useMemo(() => {
        return exercise.chains.map(chain => {
            const chainOrganisms = chain.sequence.map(id => getOrganismById(id));
            const shuffledOrganisms = shuffleArray([...chainOrganisms]);
            return {
                ...chain,
                shuffledOrganisms
            };
        });
    }, [exercise.chains]);
    
    if (isCompleted || showFinalResult) {
        return (
            <div className={styles.completedContainer}>
               <div className={styles.completedCard}>
                   <h2>Практику завершено</h2>
                   <p>Ви вже пройшли це практичне завдання.</p>
                   <div className={styles.checkIcon}><FaIcons.FaCheckCircle /></div>
               </div>
           </div>
        );
    }

    return (
        <div className={styles.exerciseContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>{exercise.title}</h2>
                <p className={styles.description}>Побудуйте харчові ланцюги, обравши правильні організми з випадаючого списку.</p>
            </div>

            <div className={styles.chainsContainer}>
                {shuffledChains.map((chain, chainIndex) => {
                    return (
                        <div key={chainIndex} className={styles.chainRow}>
                            {chain.sequence.map((organismId, stepIndex) => {
                                const organism = getOrganismById(organismId);
                                const isFirst = stepIndex === 0;
                                const answerKey = `${chainIndex}-${stepIndex}`;
                                const feedbackState = feedback[answerKey];

                                return (
                                    <div key={stepIndex} className={styles.chainItem}>
                                        {isFirst ? (
                                            <div className={styles.organismStart}>
                                                <span>{organism.name}</span>
                                            </div>
                                        ) : (
                                            <CustomSelect
                                                options={chain.shuffledOrganisms.map(o => ({ id: o.id, text: o.name }))}
                                                value={userAnswers[answerKey] || ''}
                                                onChange={(value) => handleSelectChange(chainIndex, stepIndex, value)}
                                                placeholder="Оберіть організм"
                                                feedbackState={feedbackState}
                                            />
                                        )}
                                        {stepIndex < chain.sequence.length - 1 && <span className={styles.arrow}>→</span>}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <button onClick={checkSolution} className={styles.button} disabled={attempts >= MAX_ATTEMPTS || showFinalResult}>Перевірити</button>
                <div className={styles.attemptsCounter}>
                    Спроба {attempts + 1} з {MAX_ATTEMPTS}
                </div>
            </div>
        </div>
    );
}
