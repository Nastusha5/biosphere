
import React, { useState } from 'react';
import styles from './GroupModal.module.css';

const GroupModal = ({ group, onSave, onClose }) => {
  const [name, setName] = useState(group ? group.name : '');

  const handleSave = (event) => {
    event.preventDefault();
    onSave({ ...group, name });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>{group ? 'Редагувати групу' : 'Створити групу'}</h2>
        <form className={styles.form} onSubmit={handleSave}>
          <label htmlFor="name" className={styles.label}>Назва групи</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву групи"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.submitButton}>Зберегти</button>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
