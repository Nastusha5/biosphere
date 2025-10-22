
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { database } from '../firebase'; 

export const getMessages = (studentId, callback) => {
  const messagesRef = ref(database, `chats/${studentId}`);
  return onValue(messagesRef, (snapshot) => {
    const messagesData = snapshot.val();
    if (messagesData) {
      const messagesList = Object.values(messagesData);
      callback(messagesList);
    } else {
      callback([]);
    }
  });
};

export const getDialogs = (callback) => {
  const dialogsRef = ref(database, 'chats');
  return onValue(dialogsRef, (snapshot) => {
    const dialogsData = snapshot.val();
    if (dialogsData) {
      const dialogsList = Object.keys(dialogsData).map(studentId => {
        const messages = dialogsData[studentId];
        const lastMessage = messages[Object.keys(messages)[Object.keys(messages).length - 1]];
        return {
          student: { id: studentId, firstName: 'User', lastName: studentId }, 
          lastMessage: {
            text: lastMessage.text,
            timestamp: lastMessage.timestamp
          }
        };
      });
      callback(dialogsList);
    } else {
      callback([]);
    }
  });
};

export const getChatHistory = (studentId, callback) => {
  const chatHistoryRef = ref(database, `chats/${studentId}`);
  return onValue(chatHistoryRef, (snapshot) => {
    const messagesData = snapshot.val();
    if (messagesData) {
      const messagesList = Object.values(messagesData);
      callback(messagesList);
    } else {
      callback([]);
    }
  });
};

export const sendMessage = (studentId, text, sender) => {
  const chatHistoryRef = ref(database, `chats/${studentId}`);
  const newMessage = {
    text,
    sender,
    timestamp: serverTimestamp()
  };
  return push(chatHistoryRef, newMessage);
};
