
import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import * as chatApi from '../../api/chatApi';
import { getStudentFromSession } from '../../api/studentApi';

const Chat = ({ user }) => {
  const [dialogs, setDialogs] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = chatApi.getDialogs(async (fetchedDialogs) => {
      const dialogsWithStudentData = await Promise.all(
        fetchedDialogs.map(async (dialog) => {
          const student = await getStudentFromSession(dialog.student.id);
          return {
            ...dialog,
            student: {
              ...dialog.student,
              firstName: student?.firstName || 'User',
              lastName: student?.lastName || dialog.student.id,
            },
          };
        })
      );
      setDialogs(dialogsWithStudentData.sort((a, b) => b.lastMessage.timestamp.toMillis() - a.lastMessage.timestamp.toMillis()));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectDialog = (studentId) => {
    setActiveChat(studentId);
    setLoading(true);
    const unsubscribe = chatApi.getChatHistory(studentId, chatHistory => {
      setMessages(chatHistory);
      setLoading(false);
    });
    return () => unsubscribe();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    chatApi.sendMessage(activeChat, newMessage, 'teacher')
      .then(() => {
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.dialogsList}>
        {loading && <p>Завантаження діалогів...</p>}
        {!loading && dialogs.length === 0 && <p>Активних чатів немає. Чекайте на повідомлення від учнів.</p>}
        {dialogs.map((dialog) => (
          <div
            key={dialog.student.id}
            className={`${styles.dialogItem} ${activeChat === dialog.student.id ? styles.active : ''}`}
            onClick={() => handleSelectDialog(dialog.student.id)}
          >
            <div className={styles.avatar}>
              {dialog.student.lastName[0]}
            </div>
            <div className={styles.dialogDetails}>
              <p className={styles.studentName}>{`${dialog.student.lastName} ${dialog.student.firstName}`}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.chatWindow}>
        {activeChat ? (
          <>
            <div className={styles.chatHistory} ref={chatHistoryRef}>
              {loading && <p>Завантаження повідомлень...</p>}
              {messages.map((msg, index) => (
                <div key={index} className={`${styles.message} ${msg.sender === 'teacher' ? styles.teacher : styles.student}`}>
                  <p>{msg.text}</p>
                  <span className={styles.timestamp}>{new Date(msg.timestamp?.toDate()).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <form className={styles.messageForm} onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введіть повідомлення..."
                className={styles.messageInput}
              />
              <button type="submit" className={styles.sendButton}>Надіслати</button>
            </form>
          </>
        ) : (
          <div className={styles.noChatSelected}>
            <p>Виберіть чат, щоб почати спілкування</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
