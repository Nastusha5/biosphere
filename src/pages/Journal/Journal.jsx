'use client';

import { useState, useEffect } from 'react';
import { getGroupsByTeacher, getStudentsByGroup } from '../../api/groupsApi';
import { auth } from '../../firebase';
import styles from './Journal.module.css';

const ECOSYSTEMS = [
  { id: 'desert', name: 'Пустеля' },
  { id: 'savannah', name: 'Савана' },
  { id: 'ocean', name: 'Океан' },
  { id: 'tropical-forests', name: 'Троп. ліси' },
  { id: 'swamp', name: 'Болото' },
  { id: 'agroecosystem', name: 'Агроекосистема' },
];
const TOTAL_ECOSYSTEMS = ECOSYSTEMS.length;

export default function JournalPage() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAccordionItem, setOpenAccordionItem] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchGroups(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchGroups = async (teacherId) => {
    setLoading(true);
    try {
      const fetchedGroups = await getGroupsByTeacher(teacherId);
      setGroups(fetchedGroups);
      if (fetchedGroups.length > 0) {
        const firstGroupId = fetchedGroups[0].id;
        setOpenAccordionItem(firstGroupId);
        fetchStudentsForGroup(firstGroupId);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForGroup = async (groupId) => {
    if (!students[groupId]) {
      try {
        const fetchedStudents = await getStudentsByGroup(groupId);
        setStudents((prev) => ({ ...prev, [groupId]: fetchedStudents }));
      } catch (error) {
        console.error(`Error fetching students for group ${groupId}:`, error);
      }
    }
  };

  const handleAccordionChange = (value) => {
    setOpenAccordionItem(openAccordionItem === value ? null : value);
    if (openAccordionItem !== value) {
      fetchStudentsForGroup(value);
    }
  };

  const calculateProgress = (completedEcosystems) => {
    const count = completedEcosystems?.length || 0;
    return (count / TOTAL_ECOSYSTEMS) * 100;
  };

  const calculateOverallScore = (studentScores) => {
    if (!studentScores) return 0;
    const ecosystemTotals = Object.values(studentScores).map(
      (eco) => (eco.test || 0) + (eco.exercise || 0)
    );
    if (ecosystemTotals.length === 0) return 0;
    const sum = ecosystemTotals.reduce((a, b) => a + b, 0);
    return (sum / ecosystemTotals.length).toFixed(1);
  };

  if (loading) {
    return <div>Завантаження даних...</div>;
  }

  return (
    <div className={styles.journalContainer}>
      {groups.length === 0 && !loading ? (
        <div className={styles.noGroupsCard}>
          <p>У вас ще немає груп. Створіть їх на сторінці 'Студенти'.</p>
        </div>
      ) : (
        <div className={styles.accordion}>
          {groups.map((group) => (
            <div key={group.id} className={styles.accordionItem}>
              <div
                className={styles.accordionHeader}
                onClick={() => handleAccordionChange(group.id)}
              >
                <h2 className={styles.groupName}>{group.name}</h2>
                <span
                  className={`${styles.accordionIcon} ${openAccordionItem === group.id ? styles.open : ''}`}>
                  &#9660;
                </span>
              </div>
              {openAccordionItem === group.id && (
                <div className={styles.accordionContent}>
                    <table className={styles.studentsTable}>
                      <thead>
                        <tr>
                          <th className={styles.studentNameColumn}>Ім'я студента</th>
                          <th className={styles.scoreColumn}>Загальний бал</th>
                          <th className={styles.progressColumn}>Прогрес</th>
                          {ECOSYSTEMS.map((eco, index) => (
                            <th key={eco.id} title={eco.name}>
                              <div>{index + 1}</div>
                              <div className={styles.subHeader}>
                                <span>Тест</span>
                                <span>Практика</span>
                                <span>Сума</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(students[group.id] || []).map((student) => {
                          const progress = calculateProgress(student.completedEcosystems);
                          const overallScore = calculateOverallScore(student.scores);
                          return (
                            <tr key={student.id}>
                              <td data-label="Ім'я студента" className={styles.studentNameColumn}>{`${student.lastName} ${student.firstName}`}</td>
                              <td data-label="Загальний бал" className={styles.scoreColumn}>{overallScore}</td>
                              <td data-label="Прогрес" className={styles.progressColumn}>
                                <div className={styles.progressContainer}>
                                  <progress value={progress} max="100"></progress>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                              </td>
                              {ECOSYSTEMS.map(eco => {
                                const ecoScores = student.scores?.[eco.id] || {};
                                const testScore = ecoScores.test ?? '-';
                                const exerciseScore = ecoScores.exercise ?? (eco.id === 'agroecosystem' ? '' : '-');
                                const total = (ecoScores.test || 0) + (ecoScores.exercise || 0);
                                return (
                                  <td key={eco.id} data-label={eco.name}>
                                    <div className={styles.cellContent}>
                                      <span>{testScore}</span>
                                      <span>{exerciseScore}</span>
                                      <span>{total > 0 ? total.toFixed(1) : '-'}</span>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                        {(!students[group.id] || students[group.id].length === 0) && openAccordionItem === group.id && (
                            <tr>
                                <td colSpan={3 + ECOSYSTEMS.length} style={{ textAlign: 'center' }}>
                                У цій групі ще немає студентів.
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
