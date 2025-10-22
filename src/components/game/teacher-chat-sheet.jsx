
'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessage, getMessages } from '../../firebase';
import { User, Send, Loader2, X, MessageSquare, GraduationCap } from 'lucide-react';
import styles from './teacher-chat-sheet.module.css';

export function TeacherChatSheet({ open, onOpenChange, studentId, teacherId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open && teacherId && studentId) {
      const unsubscribe = getMessages(teacherId, studentId, (loadedMessages) => {
        setMessages(loadedMessages);
      });
      return () => unsubscribe();
    }
  }, [open, teacherId, studentId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage(teacherId, studentId, studentId, input);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSenderRole = (senderId) => {
    if (senderId === studentId) return 'user';
    if (senderId === teacherId) return 'teacher';
    return 'unknown';
  };

  if (!open) return null;

  return (
    <div className={styles.sheetOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.sheetContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHeader}>
            <div>
                <h2 className={styles.sheetTitle}>
                    <MessageSquare />
                    Чат з викладачем
                </h2>
                <p className={styles.sheetDescription}>Напишіть своєму викладачеві, якщо у вас є питання</p>
            </div>
            <button onClick={() => onOpenChange(false)} className={styles.closeButton}><X /></button>
        </div>
        <div className={styles.scrollArea} ref={scrollAreaRef}>
          <div className={styles.messageContainer}>
            {messages.length === 0 && !isLoading && (
              <div className={styles.emptyState}>
                <MessageSquare className={styles.iconLarge} />
                <p>Повідомлень ще немає. <br/>Напишіть першими, щоб розпочати діалог!</p>
              </div>
            )}
            {messages.map((m) => {
              const role = getSenderRole(m.senderId);
              return (
                <div key={m.id} className={`${styles.messageRow} ${role === 'user' ? styles.userRow : styles.teacherRow}`}>
                    <div className={styles.avatar}>
                      {role === 'teacher' ? <GraduationCap size={20} /> : <User size={20} />}
                    </div>
                  <div className={`${styles.messageBubble} ${role === 'user' ? styles.userBubble : styles.teacherBubble}`}>
                    <p>{m.text}</p>
                  </div>
                </div>
              );
            })}
             {isLoading && <div className={styles.loader}></div>}
          </div>
        </div>
        <div className={styles.sheetFooter}>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишіть своє повідомлення..."
              className={styles.textarea}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className={styles.sendButton}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
