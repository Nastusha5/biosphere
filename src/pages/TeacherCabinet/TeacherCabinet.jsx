
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Groups from '../Groups/Groups';
import Chat from '../Chat/Chat';
import Journal from '../Journal/Journal';
import * as FaIcons from 'react-icons/fa';
import styles from './TeacherCabinet.module.css';

const TeacherCabinet = ({ onLogout, user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

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
      <Sidebar isOpen={isOpen} onLogout={onLogout} user={user} />
      <div className={`${styles.content} ${isChatPage ? styles.noPadding : ''}`}>
        <div className={`${styles.header} ${isChatPage ? styles.headerWithPadding : ''}`}>
          <div className={styles.toggleButton} onClick={toggleSidebar}>
            <FaIcons.FaBars />
          </div>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        </div>
        <Routes>
          <Route path="groups" element={<Groups user={user} />} />
          <Route path="chat" element={<Chat user={user} />} />
          <Route path="journal" element={<Journal />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherCabinet;
