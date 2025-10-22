
"use client";

import { useState, useEffect } from 'react';
import styles from './ecosystem-info-modal.module.css';
import { VideoTab } from './video-tab';
import { TextTab } from './text-tab';
import { TestTab } from './test-tab';
import { PracticalTab } from './practical-tab';
import { FinalScoreModal } from './final-score-modal';
import { savannahTrophicWeb } from '../../lib/ecosystems/savannah';
import { oceanTrophicWeb } from '../../lib/ecosystems/ocean';
import { swampTrophicWeb } from '../../lib/ecosystems/swamp';
import { tropicalForestsTrophicWeb } from '../../lib/ecosystems/tropical-forests';
import { desertTrophicWeb } from '../../lib/ecosystems/desert';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

const TABS = [
    { id: "video", label: "Відео", icon: <FaIcons.FaVideo /> },
    { id: "text", label: "Конспект", icon: <FaIcons.FaBookOpen /> },
    { id: "test", label: "Тест", icon: <FaIcons.FaPencilAlt /> },
    { id: "practical", label: "Практика", icon: <FaIcons.FaFlask /> },
];

export function EcosystemInfoModal({ isOpen, onClose, onComplete, ecosystem, isCompleted, test, onScoreSave, student }) {
  const [activeTab, setActiveTab] = useState("video");
  const [isVideoWatched, setIsVideoWatched] = useState(isCompleted || !ecosystem.videoId);
  const [isTextRead, setIsTextRead] = useState(isCompleted);
  const [isTestPassed, setIsTestPassed] = useState(false);
  const [isPracticalPassed, setIsPracticalPassed] = useState(false);
  const [isTestJustCompleted, setIsTestJustCompleted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [practicalScore, setPracticalScore] = useState(null);
  const [showFinalScoreModal, setShowFinalScoreModal] = useState(false);

  useEffect(() => {
    if (student?.scores && student.scores[ecosystem.id]) {
      const savedScores = student.scores[ecosystem.id];
      if (savedScores.test !== undefined) {
        setIsTestPassed(true);
        setTestScore(savedScores.test);
      }
      if (savedScores.exercise !== undefined) {
        setIsPracticalPassed(true);
        setPracticalScore(savedScores.exercise);
      }
    }
    if (!isCompleted) {
        const savedTestScore = student?.scores?.[ecosystem.id]?.test;
        setIsTestPassed(savedTestScore !== undefined);
     } else {
        setIsTestPassed(true);
        setIsPracticalPassed(true);
     }
  }, [student, ecosystem.id, isOpen, isCompleted]);

  const handleVideoEnd = () => {
    setIsVideoWatched(true);
    setActiveTab("text");
  };

  const handleTabChange = (value) => {
    if (value === "text" && isVideoWatched) {
      setIsTextRead(true);
    }
    setActiveTab(value);
  }

  const handleTestComplete = (score) => {
    onScoreSave(ecosystem.id, 'test', score);
    setTestScore(score);
    setIsTestPassed(true);
    setIsTestJustCompleted(true);
  }

  const proceedFromTest = () => {
    setIsTestJustCompleted(false);
    const hasPractical = ['savannah', 'ocean', 'swamp', 'tropical-forests', 'desert'].includes(ecosystem.id);
    if (hasPractical) {
        setActiveTab('practical');
    } else {
        setShowFinalScoreModal(true);
    }
  }

  const handlePracticalComplete = (score) => {
      onScoreSave(ecosystem.id, 'exercise', score);
      setPracticalScore(score);
      setIsPracticalPassed(true);
      setShowFinalScoreModal(true);
  }

  const getExerciseData = () => {
    switch (ecosystem.id) {
      case 'savannah': return savannahTrophicWeb;
      case 'ocean': return oceanTrophicWeb;
      case 'swamp': return swampTrophicWeb;
      case 'tropical-forests': return tropicalForestsTrophicWeb;
      case 'desert': return desertTrophicWeb;
      default: return null;
    }
  }
  
  const isAgroecosystem = ecosystem.id === 'agroecosystem';
  const hasPracticalExercise = ['savannah', 'ocean', 'swamp', 'tropical-forests', 'desert'].includes(ecosystem.id);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.dialogOverlay}>
        <div className={styles.dialogContent}>
          <div className={styles.dialogHeader}>
            <h2 className={styles.dialogTitle}>{ecosystem.name}</h2>
            <button onClick={onClose} className={styles.closeButton}><AiIcons.AiOutlineClose /></button>
          </div>

          <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
              {TABS.filter(tab => hasPracticalExercise || tab.id !== 'practical').map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={(
                    (tab.id === 'text' && !isVideoWatched) ||
                    (tab.id === 'test' && (!isTextRead || !test)) ||
                    (tab.id === 'practical' && !isTestPassed)
                  )}
                  className={`${styles.tabTrigger} ${activeTab === tab.id ? styles.activeTab : ''}`}>
                  {tab.icon} <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className={styles.tabsContent}>
              {activeTab === 'video' && 
                <VideoTab videoId={ecosystem.videoId} onVideoEnd={handleVideoEnd} />
              }
              {activeTab === 'text' && 
                <TextTab 
                  content={ecosystem.content} 
                  funFact={ecosystem.funFact} 
                  onProceed={() => setActiveTab('test')}
                  canProceed={!!test}
                />
              }
              {activeTab === 'test' && 
                <TestTab 
                  test={test} 
                  onComplete={handleTestComplete} 
                  isCompleted={isTestPassed}
                  isJustCompleted={isTestJustCompleted}
                  onProceed={proceedFromTest}
                  student={student}
                  ecosystemId={ecosystem.id}
                />
              }
              {activeTab === 'practical' && hasPracticalExercise && 
                <PracticalTab 
                  exercise={getExerciseData()} 
                  onComplete={handlePracticalComplete}
                  isCompleted={isPracticalPassed}
                />
              }
            </div>
          </div>
        </div>
      </div>
      <FinalScoreModal 
          isOpen={showFinalScoreModal} 
          onClose={onComplete} // Pass onComplete here
          testScore={testScore}
          practicalScore={isAgroecosystem ? null : practicalScore}
      />
    </>
  );
}
