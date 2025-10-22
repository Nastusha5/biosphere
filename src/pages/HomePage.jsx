import Particles from '../components/Particles/Particles';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.background}></div>
      <Particles />
      <div className={styles.content}>
        <img src="/backgrounds/title.png" alt="Title" className={styles.titleImage} />
      </div>
    </div>
  );
};

export default HomePage;
