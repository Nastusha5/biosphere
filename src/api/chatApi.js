
import { collection, query, onSnapshot, addDoc, serverTimestamp, getDocs, doc, setDoc, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { getStudentFromSession } from "./studentApi";

export const getMessages = (studentId, callback) => {
  const messagesRef = collection(db, `chats/${studentId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const messagesList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    callback(messagesList);
  });
};

export const getDialogs = (callback) => {
  const dialogsRef = collection(db, 'chats');
  const q = query(dialogsRef, orderBy("lastMessage.timestamp", "desc"));

  return onSnapshot(q, (snapshot) => {
    const dialogsList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        student: data.student,
        lastMessage: data.lastMessage,
      };
    });
    callback(dialogsList);
  });
};

export const getChatHistory = (studentId, callback) => {
  const chatHistoryRef = collection(db, `chats/${studentId}/messages`);
  const q = query(chatHistoryRef, orderBy("timestamp", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const messagesList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    callback(messagesList);
  });
};

export const sendMessage = async (studentId, text, sender) => {
  const messagesRef = collection(db, `chats/${studentId}/messages`);
  const chatDocRef = doc(db, 'chats', studentId);

  const newMessage = {
    text,
    sender,
    timestamp: serverTimestamp(),
  };

  addDoc(messagesRef, newMessage);

  const student = await getStudentFromSession(studentId);

  return setDoc(chatDocRef, {
    lastMessage: {
      text,
      timestamp: serverTimestamp(),
    },
    student: { 
      id: studentId, 
      firstName: student?.firstName || 'User', 
      lastName: student?.lastName || studentId, 
    },
  }, { merge: true });
};
