
import React, { useState, useEffect } from 'react';
import styles from './GroupModal.module.css';

const StudentModal = ({ student, onSave, onClose }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (student) {
      setLastName(student.lastName || '');
      setFirstName(student.firstName || '');
      if (student.name && !student.lastName && !student.firstName) {
        const nameParts = student.name.split(' ');
        setLastName(nameParts[0] || '');
        setFirstName(nameParts.slice(1).join(' ') || '');
      }
    } else {
      setLastName('');
      setFirstName('');
    }
  }, [student]);

  const handleSave = (event) => {
    event.preventDefault();
    const studentData = { ...student, lastName, firstName };
    delete studentData.name;
    onSave(studentData);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>{student ? 'Редагувати учня' : 'Додати учня'}</h2>
        <form className={styles.form} onSubmit={handleSave}>
          <label htmlFor="lastName" className={styles.label}>Прізвище</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Введіть прізвище"
            className={styles.input}
            required
          />
          <label htmlFor="firstName" className={styles.label}>Ім'я</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Введіть ім'я"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.submitButton}>Зберегти</button>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
