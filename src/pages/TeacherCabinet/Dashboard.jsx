
import React, { useState, useEffect } from 'react';
import { getGroups } from '../../api/groupsApi';
import styles from './Dashboard.module.css';

const Dashboard = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const fetchedGroups = await getGroups(user.uid);
          setGroups(fetchedGroups);
          const totalStudents = fetchedGroups.reduce((acc, group) => acc + (group.students?.length || 0), 0);
          setStudentCount(totalStudents);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.welcomeMessage}>
        Вітаю, {user.lastName} {user.firstName}!
      </h2>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Кількість груп</h3>
          <p>{groups.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Кількість учнів</h3>
          <p>{studentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
