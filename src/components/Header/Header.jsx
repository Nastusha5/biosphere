import styles from './Header.module.css';

const Header = ({ onLoginClick, currentUser, onLogout }) => {
  return (
    <header className={styles.header}>
      {currentUser ? (
        <button onClick={onLogout} className={styles.loginButton}>Вийти</button>
      ) : (
        <button onClick={onLoginClick} className={styles.loginButtonOutline}>Увійти</button>
      )}
    </header>
  );
};

export default Header;
