
"use client";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveStudentScore, completeEcosystemForStudent } from '../../firebase';
import { ProgressTracker } from '../../components/game/progress-tracker';
import { VideoPlayerModal } from '../../components/game/video-player';
import { EcosystemInfoModal } from '../../components/game/ecosystem-info-modal';
import { CompletionModal } from '../../components/game/completion-modal';
import { GradesModal } from '../../components/game/grades-modal'; // Import GradesModal
import { savannahContent, savannahFunFact } from '../../lib/ecosystems/savannah';
import { desertContent, desertFunFact } from '../../lib/ecosystems/desert';
import { swampContent, swampFunFact } from '../../lib/ecosystems/swamp';
import { oceanContent, oceanFunFact } from '../../lib/ecosystems/ocean';
import { agroecosystemContent, agroecosystemFunFact } from '../../lib/ecosystems/agroecosystem';
import { tropicalForestsContent, tropicalForestsFunFact } from '../../lib/ecosystems/tropical-forests';
import { AiMentorSheet } from '../../components/game/ai-mentor-sheet';
import { TeacherChatSheet } from '../../components/game/teacher-chat-sheet';
import { allTests } from '../../lib/ecosystems/tests';
import styles from './StudentGame.module.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

const ECOSYSTEMS = [
  { id: 'desert', name: 'Пустеля', icon: '/progress/desert.png', content: desertContent, funFact: desertFunFact, videoId: 'g6FIFhufiVs', testId: 'desert-test' },
  { id: 'savannah', name: 'Савана', icon: '/progress/savannah.png', content: savannahContent, funFact: savannahFunFact, videoId: 'qh7JLKIJ4Nc', testId: 'savannah-test' },
  { id: 'ocean', name: 'Океан', icon: '/progress/ocean.png', content: oceanContent, funFact: oceanFunFact, videoId: 'jHwXRPBCsec', testId: 'ocean-test' },
  { id: 'tropical-forests', name: 'Тропічні ліси', icon: '/progress/tropical-forests.png', content: tropicalForestsContent, funFact: tropicalForestsFunFact, videoId: 'Mv5Vvy9E3KQ', testId: 'tropical-forests-test' },
  { id: 'swamp', name: 'Мангрові угіддя', icon: '/progress/swamp.png', content: swampContent, funFact: swampFunFact, videoId: 'KlVmRjcN0Yk', testId: 'swamp-test' },
  { id: 'agroecosystem', name: 'Агроекосистема', icon: '/progress/agroecosystem.png', content: agroecosystemContent, funFact: agroecosystemFunFact, videoId: null, testId: 'agroecosystem-test' },
];

export default function GamePage({ user, onLogout }) {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();
    const [completedEcosystems, setCompletedEcosystems] = useState([]);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isResearchStarted, setIsResearchStarted] = useState(false);
    const [introVideoCompleted, setIntroVideoCompleted] = useState(false);
    const [activeInfoModal, setActiveInfoModal] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [lastCompletedEcosystem, setLastCompletedEcosystem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
    const [isTeacherChatOpen, setIsTeacherChatOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGradesModalOpen, setIsGradesModalOpen] = useState(false); // State for grades modal

    const currentEcosystem = ECOSYSTEMS.find(eco => !completedEcosystems.includes(eco.id));
    const allEcosystemsCompleted = completedEcosystems.length === ECOSYSTEMS.length;

    useEffect(() => {
      if (!user) {
          navigate('/');
      } else {
          setStudent(user);
          const userScores = user.scores || {};
          const hasProgress = Object.keys(userScores).length > 0;
          
          setCompletedEcosystems(user.completedEcosystems || []);
          
          if (hasProgress) {
              setIntroVideoCompleted(true);
              setIsResearchStarted(true);
          }
          
          setLoading(false);
      }
  }, [user, navigate]);
    
    const handleSaveScore = async (ecosystemId, scoreType, score, answers) => {
        if (!student || score < 0) return;
        await saveStudentScore(student.id, ecosystemId, scoreType, score, answers); // Pass answers
    }
    
    const handleStartResearch = () => {
        setIsResearchStarted(true);
        setIsVideoModalOpen(true);
    };
    
    const handleVideoEnd = () => {
        setIsVideoModalOpen(false);
        setIntroVideoCompleted(true);
    }
    
    const handleExploreEcosystem = (ecosystemId) => {
        setActiveInfoModal(ecosystemId);
    }

    const handleCompleteEcosystem = async (ecosystemId) => {
        const ecosystem = ECOSYSTEMS.find(e => e.id === ecosystemId);
        if (!ecosystem || completedEcosystems.includes(ecosystemId) || !student) return;

        setActiveInfoModal(null);
        
        setLastCompletedEcosystem(ecosystem);
        setShowCompletionModal(true);
        
        await completeEcosystemForStudent(student.id, ecosystemId);
    };

    if (loading || !student) {
        return <div className={styles.loading}>Завантаження...</div>;
    }

    return (
        <div className={styles.gamePage}>
            <img
                src="/backgrounds/background.jpeg"
                alt="Фон"
                className={styles.backgroundImage}
                data-ai-hint="mars background"
            />
            {allEcosystemsCompleted && (
                <div className={styles.overlay}></div>
            )}
            
            <div className={styles.gameContent}>
                <div className={styles.progressTrackerContainer}>
                    <ProgressTracker completedEcosystems={completedEcosystems} />
                </div>

                
                <div className={styles.mainContent}>
                {!isResearchStarted && !introVideoCompleted && (
                        <div className={styles.startResearchContainer}>
                            <button className={`${styles.button} ${styles.lgButton} ${styles.startResearchButton}`} onClick={handleStartResearch}>
                                Почати дослідження
                            </button>
                        </div>
                    )}
                {introVideoCompleted && currentEcosystem && !allEcosystemsCompleted && (
                        <div className={styles.ecosystemExploreContainer}>
                            <h2 className={styles.ecosystemSubheading}>Екосистема</h2>
                            <h1 className={styles.ecosystemHeading}>{currentEcosystem.name.toUpperCase()}</h1>
                            <button className={`${styles.button} ${styles.lgButton} ${styles.exploreButton}`} onClick={() => handleExploreEcosystem(currentEcosystem.id)}>
                                Дослідити
                            </button>
                        </div>
                    )}
                    {introVideoCompleted && allEcosystemsCompleted && (
                        <div className={styles.completionContainer}>
                            <img
                                src="/progress/winner.png"
                                alt="Переможець"
                                width={160}
                                height={160}
                                className="mb-8"
                            />
                            <h1 className={styles.completionHeading}>Вітаємо!</h1>
                            <p className={styles.completionText}>Ти опанував всі екосистеми Біосфери-2</p>
                        </div>
                    )}
                </div>
            </div>

            {!loading && student && (
                 <div className={styles.bottomBar}>
                    <div className={styles.bottomNav}>
                        <button className={`${styles.button} ${styles.ghostButton} ${styles.navButton}`} onClick={() => setIsAiMentorOpen(true)}>
                            <FaIcons.FaRobot />
                        </button>
                         <button className={`${styles.button} ${styles.ghostButton} ${styles.navButton}`} onClick={() => setIsTeacherChatOpen(true)}>
                            <AiIcons.AiOutlineWechat />
                        </button>
                        <div className={styles.dropdownContainer}>
                            <button className={`${styles.button} ${styles.ghostButton} ${styles.navButton}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)} disabled={completedEcosystems.length === 0}>
                                <FaIcons.FaBook />
                            </button>
                            {isDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownMenuLabel}>Пройдені екосистеми</div>
                                    <div className={styles.dropdownMenuSeparator}></div>
                                    {completedEcosystems.length > 0 ? (
                                        ECOSYSTEMS.filter(eco => completedEcosystems.includes(eco.id)).map(eco => (
                                            <div key={eco.id} className={styles.dropdownMenuItem} onClick={() => {handleExploreEcosystem(eco.id); setIsDropdownOpen(false);}}>
                                                {eco.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className={`${styles.dropdownMenuItem} ${styles.disabled}`}>Ви ще не пройшли жодної екосистеми</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {allEcosystemsCompleted && (
                            <button className={`${styles.button} ${styles.ghostButton} ${styles.navButton}`} onClick={() => setIsGradesModalOpen(true)}>
                                <FaIcons.FaGraduationCap />
                            </button>
                        )}
                        <button onClick={onLogout} className={`${styles.button} ${styles.ghostButton} ${styles.navButton}`}>
                            <FaIcons.FaSignOutAlt />
                        </button>
                    </div>
                </div>
            )}
            
            <VideoPlayerModal 
              isOpen={isVideoModalOpen} 
              onClose={() => {
                if (!introVideoCompleted) {
                  setIsVideoModalOpen(false)
                }
              }}
              onVideoEnd={handleVideoEnd}
              videoId="PtXPkaXL4g4" 
            />
            
            <AiMentorSheet open={isAiMentorOpen} onOpenChange={setIsAiMentorOpen} />
            
            {student && (
              <TeacherChatSheet
                open={isTeacherChatOpen}
                onOpenChange={setIsTeacherChatOpen}
                studentId={student.id}
                teacherId={student.teacherId}
              />
            )}

            {ECOSYSTEMS.map(eco => (
                <EcosystemInfoModal
                    key={eco.id}
                    isOpen={activeInfoModal === eco.id}
                    onClose={() => setActiveInfoModal(null)}
                    onComplete={() => handleCompleteEcosystem(eco.id)}
                    ecosystem={eco}
                    isCompleted={completedEcosystems.includes(eco.id)}
                    test={allTests.find(t => t.id === eco.testId)}
                    onScoreSave={handleSaveScore}
                    student={student}
                />
            ))}

            {showCompletionModal && lastCompletedEcosystem && (
                 <CompletionModal
                    ecosystem={lastCompletedEcosystem}
                    onClose={() => setShowCompletionModal(false)}
                />
            )}

            <GradesModal 
                isOpen={isGradesModalOpen} 
                onClose={() => setIsGradesModalOpen(false)} 
                student={student} 
                ecosystems={ECOSYSTEMS} 
            />
        </div>
    );
}
