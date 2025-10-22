
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, X, CornerDownLeft } from 'lucide-react';
import styles from './ai-mentor-sheet.module.css';

const askAiMentor = async ({ question, history }) => {
    console.log("Asking AI Mentor:", { question, history });
    await new Promise(resolve => setTimeout(resolve, 1500));
    const responses = [
        "Біосфера-2 — це унікальна наукова споруда, що симулює різні земні екосистеми. Які саме вас цікавлять?",
        "В савані головними хижаками є леви, а в океані — великі акули. Це створює баланс у трофічній мережі.",
        "Пустелі отримують дуже мало опадів, тому рослини там, як-от кактуси, пристосувалися накопичувати воду.",
        "Агроекосистеми створені людиною для виробництва їжі. Вони менш стійкі, ніж природні, і потребують догляду.",
        "Ваше питання дуже цікаве! Давайте розберемося разом. Що саме ви хочете дізнатися про це?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
};

const MarkdownRenderer = ({ content }) => {
    const renderContent = () => {
        const blocks = content.split('\n\n');
        return blocks.map((block, index) => {
            if (block.startsWith('*') || block.startsWith('-')) {
                const items = block.split('\n').map((item, i) => (
                    <li key={i} className={styles.proseListItem}>{item.substring(2)}</li>
                ));
                return <ul key={index} className={styles.proseList}>{items}</ul>;
            }
            return <p key={index} className={styles.proseParagraph}>{block}</p>;
        });
    };
    return <div className={styles.prose}>{renderContent()}</div>;
};

export function AiMentorSheet({ open, onOpenChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const textareaRef = useRef(null);

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

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-10); 
      const response = await askAiMentor({ question: input, history });
      const assistantMessage = { role: 'model', parts: [{ text: response }] };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking AI mentor:', error);
      const errorMessage = { role: 'model', parts: [{ text: 'На жаль, сталася помилка. Спробуйте, будь ласка, ще раз.' }] };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.sheetOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.sheetContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHeader}>
            <div>
                <h2 className={styles.sheetTitle}>
                    <Bot />
                    AI-ментор
                </h2>
                <p className={styles.sheetDescription}>
                    Ваш персональний помічник у світі Біосфери-2
                </p>
            </div>
            <button onClick={() => onOpenChange(false)} className={styles.closeButton}><X /></button>
        </div>
        <div className={styles.scrollArea} ref={scrollAreaRef}>
          <div className={styles.messageContainer}>
            {messages.length === 0 && (
                <div className={styles.noMessages}>
                    <div className={styles.noMessagesIcon}>🤖</div>
                    <p>Немає повідомлень. <br/>Задайте перше питання, щоб почати розмову!</p>
                </div>
            )}
            {messages.map((m, i) => {
                const messageText = m.parts.map(p => p.text).join('');
                return (
                  <div
                    key={i}
                    className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.modelMessage}`}>
                    <div className={styles.avatar}>
                      {m.role === 'model' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className={styles.messageContent}>
                      {m.role === 'model' ? <MarkdownRenderer content={messageText} /> : messageText}
                    </div>
                  </div>
                )
            })}
            {isLoading && (
                <div className={`${styles.message} ${styles.modelMessage}`}>
                    <div className={styles.avatar}>
                        <Bot size={20} />
                    </div>
                    <div className={styles.loadingBubble}>
                         <Loader2 className={styles.loadingIcon} />
                    </div>
                </div>
            )}
          </div>
        </div>
        <div className={styles.sheetFooter}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишіть своє питання AI-ментору..."
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
              <Send className={styles.sendIcon} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
