
'use client';

import { useState, useEffect } from 'react';
import styles from './ecosystem-test.module.css';
import * as FaIcons from 'react-icons/fa';
import { CustomSelect } from './custom-select';

export function EcosystemTest({ test, onComplete, isCompleted, isJustCompleted, ecosystemId, onProceed, student }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null);
    
    useEffect(() => {
        const savedTestScore = student?.scores?.[ecosystemId]?.test;
        if (isCompleted || savedTestScore !== undefined) {
             setShowResults(false);
        } else {
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setShowResults(false);
            setFinalScore(null);
            setCorrectAnswersCount(null);
        }
    }, [test.id, ecosystemId, student, isCompleted]);

    const currentQuestion = test.questions[currentQuestionIndex];
    const totalQuestions = test.questions.length;
    const progress = (currentQuestionIndex / totalQuestions) * 100;

    const handleSingleChoiceChange = (value) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: value }));
    };
    
    const handleMatchingChange = (pairId, matchId) => {
        const currentAnswers = userAnswers[currentQuestionIndex] || {};
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: {
                ...(typeof currentAnswers === 'object' ? currentAnswers : {}),
                [pairId]: matchId,
            }
        }));
    };
    
    const isCurrentQuestionAnswered = () => {
        const answer = userAnswers[currentQuestionIndex];
        if (answer === undefined) return false;
        if(currentQuestion.type === 'matching') {
            return typeof answer === 'object' && Object.keys(answer).length === currentQuestion.pairs.length;
        }
        return true;
    }

    const calculateAndShowResults = () => {
        let calculatedScore = 0;
        let correctCount = 0;
        test.questions.forEach((q, index) => {
            const answer = userAnswers[index];
            let isQuestionCorrect = false;
            if (q.type === 'single-choice' && answer === q.correctAnswer) {
                isQuestionCorrect = true;
            } else if (q.type === 'matching' && typeof answer === 'object' && answer !== null) {
                if (Object.entries(q.correctMapping).every(([pairId, correctMatchId]) => answer[Number(pairId)] === correctMatchId)) {
                    isQuestionCorrect = true;
                }
            }
            if (isQuestionCorrect) {
                correctCount++;
                calculatedScore += (ecosystemId === 'agroecosystem') ? 2 : (q.type === 'matching' ? 3 : 1.2);
            }
        });
        
        const finalScoreValue = parseFloat(calculatedScore.toFixed(1));
        setFinalScore(finalScoreValue);
        setCorrectAnswersCount(correctCount);
        setShowResults(true);
        onComplete(finalScoreValue);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateAndShowResults();
        }
    };
    
    if (isCompleted && !isJustCompleted) {
        return (
           <div className={styles.completedContainer}>
               <div className={styles.completedCard}>
                   <h2>Тест завершено</h2>
                   <p>Ви вже пройшли цей тест.</p>
                   <div className={styles.checkIcon}><FaIcons.FaCheckCircle /></div>
               </div>
           </div>
       )
   }
    
    if (showResults || isJustCompleted) {
        const score = finalScore ?? student?.scores?.[ecosystemId]?.test ?? 0;
        const percentage = totalQuestions > 0 ? ((correctAnswersCount ?? score / 1.2) / totalQuestions) * 100 : 0;

        return (
            <div className={styles.resultsContainer}>
                 <div className={styles.resultsCard}>
                    <h2>Результати тесту</h2>
                    <p>Результати для "{test.title}"</p>
                    
                    <div className={styles.resultsDonut}>
                        <svg width="120" height="120" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e6e6e6"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={percentage >= 50 ? "#f26f21" : "#f44336"}
                                strokeWidth="3"
                                strokeDasharray={`${percentage}, 100`}
                            />
                             <text x="18" y="20" textAnchor="middle" fontSize="5" fill="#333">{`${Math.round(percentage)}%`}</text>
                        </svg>
                    </div>

                    <div className={styles.resultsContent}>
                       <p>Правильно: <span>{correctAnswersCount ?? Math.round(score/1.2)}/{totalQuestions}</span></p>
                       <p className={styles.finalScore}>Ваш бал: {score}</p>
                    </div>

                    <div className={styles.resultsFooter}>
                        <button onClick={onProceed} className={styles.button}>
                            {ecosystemId === 'agroecosystem' ? 'Завершити' : 'До практики'}
                        </button>
                    </div>
                 </div>
            </div>
        );
    }

    return (
        <div className={styles.testWrapper}>
            <div className={styles.header}>
                <p className={styles.progressText}>Питання {currentQuestionIndex + 1} з {totalQuestions}</p>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            
            <div className={styles.questionCard}>
                <h3>{currentQuestion.question}</h3>
                {currentQuestion.type === 'single-choice' && (
                    <div className={styles.optionsGrid}>
                        {currentQuestion.options.map((option, index) => (
                            <label key={index} className={`${styles.optionCard} ${userAnswers[currentQuestionIndex] === option.id ? styles.selected : ''}`}>
                                <input 
                                    type="radio" 
                                    name={`q${currentQuestionIndex}`}
                                    value={option.id} 
                                    checked={userAnswers[currentQuestionIndex] === option.id}
                                    onChange={(e) => handleSingleChoiceChange(e.target.value)}
                                    className={styles.radioInput}
                                />
                                <div className={styles.optionContent}>
                                    <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                                    {option.text}
                                </div>
                            </label>
                        ))}
                    </div>
                )}
                
                {currentQuestion.type === 'matching' && (
                    <div className={styles.matchingContainer}>
                        {currentQuestion.pairs.map((pair) => (
                            <div key={pair.id} className={styles.matchingRow}>
                                <div className={styles.matchingPairText}>{pair.id}. {pair.text}</div>
                                <CustomSelect
                                    options={currentQuestion.matches}
                                    value={(userAnswers[currentQuestionIndex] || {})[pair.id] || ''}
                                    onChange={(value) => handleMatchingChange(pair.id, value)}
                                    placeholder="Оберіть відповідність..."
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.navigationFooter}>
                <button 
                    onClick={handleNextQuestion} 
                    disabled={!isCurrentQuestionAnswered()}
                    className={styles.button}
                >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Наступне' : 'Завершити'}
                </button>
            </div>
        </div>
    );
}
