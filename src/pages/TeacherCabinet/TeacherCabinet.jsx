
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Groups from '../Groups/Groups';
import Chat from '../Chat/Chat';
import Journal from '../Journal/Journal';
import Dashboard from './Dashboard';
import * as FaIcons from 'react-icons/fa';
import styles from './TeacherCabinet.module.css';

const TeacherCabinet = ({ onLogout, user }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/teacher/groups')) return 'Групи';
    if (path.includes('/teacher/dashboard')) return 'Дашборд';
    if (path.includes('/teacher/journal')) return 'Журнал';
    if (path.includes('/teacher/chat')) return 'Чат';
    return 'Кабінет викладача';
  };

  const isChatPage = location.pathname.includes('/teacher/chat');

  return (
    <div className={styles.teacherCabinet}>
      {isMobile && isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
      <Sidebar isOpen={isOpen} onLogout={onLogout} user={user} />
      <div className={`${styles.content} ${isChatPage ? styles.noPadding : ''} ${isOpen && isMobile ? styles.contentBlurred : ''}`}>
        <div className={`${styles.header} ${isChatPage ? styles.headerWithPadding : ''}`}>
          <div className={styles.toggleButton} onClick={toggleSidebar}>
            <FaIcons.FaBars />
          </div>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        </div>
        <Routes>
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="groups" element={<Groups user={user} />} />
          <Route path="chat" element={<Chat user={user} />} />
          <Route path="journal" element={<Journal />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherCabinet;
