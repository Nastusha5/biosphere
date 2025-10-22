
import { useState, useEffect, useRef } from 'react';
import styles from './custom-select.module.css';
import * as FaIcons from 'react-icons/fa';

export function CustomSelect({ options, value, onChange, placeholder, feedbackState }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(option => option.id === value);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const headerClasses = [styles.selectHeader];
  if (feedbackState === 'correct') headerClasses.push(styles.correct);
  if (feedbackState === 'incorrect') headerClasses.push(styles.incorrect);

  return (
    <div className={styles.selectContainer} ref={selectRef}>
      <button className={headerClasses.join(' ')} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.text : placeholder}</span>
        <FaIcons.FaChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </button>
      {isOpen && (
        <div className={styles.optionsContainer}>
          {options.map((option) => (
            <div
              key={option.id}
              className={`${styles.option} ${value === option.id ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option.id)}
            >
              {option.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
