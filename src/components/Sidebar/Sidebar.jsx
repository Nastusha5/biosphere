
import React from 'react';
import { NavLink } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onLogout }) => {
  const menuItems = [
    {
      path: '/teacher/dashboard',
      name: 'Дашборд',
      icon: <AiIcons.AiFillHome />,
    },
    {
      path: '/teacher/groups',
      name: 'Групи',
      icon: <FaIcons.FaUserFriends />,
    },
    {
      path: '/teacher/journal',
      name: 'Журнал',
      icon: <FaIcons.FaBook />,
    },
    {
      path: '/teacher/chat',
      name: 'Чат',
      icon: <AiIcons.AiOutlineWechat />,
    },
  ];

  const logoutItem = {
    name: 'Вийти',
    icon: <FaIcons.FaSignOutAlt />,
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.logoContainer}>
        <img src="/progress/winner.png" alt="Logo" className={styles.logo} />
        <h1 className={`${styles.title} ${isOpen ? styles.visible : styles.hidden}`}>Біосфера 2.0</h1>
      </div>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => (
          <li key={index} className={styles.menuItem}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => isActive ? `${styles.menuLink} ${styles.active}` : styles.menuLink}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={`${styles.text} ${isOpen ? styles.visible : styles.hidden}`}>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <ul className={styles.logoutMenu}>
          <li className={styles.menuItem}>
            <button onClick={onLogout} className={styles.menuLink}>
              <span className={styles.icon}>{logoutItem.icon}</span>
              <span className={`${styles.text} ${isOpen ? styles.visible : styles.hidden}`}>{logoutItem.name}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
