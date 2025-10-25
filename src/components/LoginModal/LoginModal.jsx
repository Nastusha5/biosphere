
import { useState, useId } from 'react';
import styles from './LoginModal.module.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, setDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('student'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const randomString = useId();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsRegistering(false);
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const { registerLastName, registerFirstName, registerEmail, registerPassword } = e.target.elements;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value);
      const user = userCredential.user;

      await setDoc(doc(db, "teachers", user.uid), {
        lastName: registerLastName.value,
        firstName: registerFirstName.value,
        email: registerEmail.value,
      });

      onLogin(user);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { loginEmail, loginPassword } = e.target.elements;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      onLogin(userCredential.user);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { studentPassword } = e.target.elements;
    const passwordValue = studentPassword.value.trim();

    try {
      const groupsCollectionRef = collection(db, 'groups');
      const groupsSnapshot = await getDocs(groupsCollectionf);
      let foundStudent = null;

      for (const groupDoc of groupsSnapshot.docs) {
        const studentsSubcollectionRef = collection(db, 'groups', groupDoc.id, 'students');
        const q = query(studentsSubcollectionRef, where("password", "==", passwordValue), limit(1));
        const studentSnapshot = await getDocs(q);

        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          foundStudent = { id: studentDoc.id, ...studentDoc.data() };
          break; 
        }
      }

      if (foundStudent) {
        onLogin(foundStudent);
        onClose();
      } else {
        setError('Неправильний пароль');
      }
    } catch (error) {
      console.error("Student login error:", error);
      setError('Помилка входу. Перевірте консоль для деталей.');
    }
  };

  const title = () => {
    if (activeTab === 'student') {
      return 'Вхід для учня';
    }
    if (isRegistering) {
      return 'Реєстрація викладача';
    }
    return 'Вхід для викладача';
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'student' ? styles.active : ''}`}
            onClick={() => handleTabChange('student')}
          >
            Учень
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'teacher' ? styles.active : ''}`}
            onClick={() => handleTabChange('teacher')}
          >
            Викладач
          </button>
        </div>

        <h2 className={styles.title}>{title()}</h2>
        {error && <p className={styles.error}>{error}</p>}

        {activeTab === 'student' ? (
          <form className={styles.form} onSubmit={handleStudentLogin}>
            <label htmlFor="studentPassword" className={styles.label}>Пароль учня</label>
            <input type="password" id="studentPassword" name="studentPassword" className={styles.input} placeholder="Введіть ваш пароль" required autoComplete="off"/>
            <button type="submit" className={styles.submitButton}>Увійти</button>
          </form>
        ) : isRegistering ? (
          <form className={styles.form} onSubmit={handleRegister}>
            <label htmlFor="registerLastName" className={styles.label}>Прізвище</label>
            <input type="text" id="registerLastName" name="registerLastName" className={styles.input} placeholder="Введіть ваше прізвище" required autoComplete="family-name"/>
            
            <label htmlFor="registerFirstName" className={styles.label}>Ім'я</label>
            <input type="text" id="registerFirstName" name="registerFirstName" className={styles.input} placeholder="Введіть ваше ім'я" required autoComplete="given-name"/>

            <label htmlFor="registerEmail" className={styles.label}>Електронна пошта</label>
            <input type="email" id="registerEmail" name="registerEmail" className={styles.input} placeholder="Введіть вашу пошту" required autoComplete={`username-${randomString}`}/>

            <label htmlFor="registerPassword" className={styles.label}>Пароль</label>
            <input type="password" id="registerPassword" name="registerPassword" className={styles.input} placeholder="Введіть ваш пароль" required autoComplete="new-password"/>

            <button type="submit" className={styles.submitButton}>Зареєструватися</button>
            <button type="button" className={styles.toggleFormButton} onClick={() => setIsRegistering(false)}>
              Назад до входу
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleLogin}>
            <input type="password" name="password" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
            <label htmlFor="loginEmail" className={styles.label}>Електронна пошта</label>
            <input type="email" id="loginEmail" name="loginEmail" className={styles.input} placeholder="Введіть вашу пошту" required autoComplete={`username-${randomString}`}/>
            <label htmlFor="loginPassword" className={styles.label}>Пароль</label>
            <input type="password" id="loginPassword" name="loginPassword" className={styles.input} placeholder="Введіть ваш пароль" required autoComplete="current-password"/>

            <button type="submit" className={styles.submitButton}>Увійти</button>

            <button type="button" className={styles.toggleFormButton} onClick={() => setIsRegistering(true)}>
              Зареєструватися
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
