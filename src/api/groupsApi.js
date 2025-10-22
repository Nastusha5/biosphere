
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const groupsCollection = collection(db, 'groups');

export const getGroupsByTeacher = async (teacherId) => {
  const q = query(groupsCollection, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getStudentsByGroup = async (groupId) => {
    const groupStudentsCollection = collection(db, `groups/${groupId}/students`);
    const groupStudentsSnapshot = await getDocs(groupStudentsCollection);
    
    const studentPromises = groupStudentsSnapshot.docs.map(async (studentSubDoc) => {
        const studentDocRef = doc(db, 'students', studentSubDoc.id);
        const studentDoc = await getDoc(studentDocRef);
        
        const subData = studentSubDoc.data();
        
        if (studentDoc.exists()) {
            return { ...subData, ...studentDoc.data(), id: studentSubDoc.id };
        }
        
        return { id: studentSubDoc.id, ...subData };
    });
    
    return await Promise.all(studentPromises);
}

export const createGroup = async (groupName, teacherId) => {
  const newGroup = { name: groupName, teacherId: teacherId };
  const docRef = await addDoc(groupsCollection, newGroup);
  return { ...newGroup, id: docRef.id };
};

export const updateGroup = async (groupId, groupName) => {
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, { name: groupName });
};

export const deleteGroup = async (groupId) => {
  await deleteDoc(doc(db, "groups", groupId));
};

export const createStudent = async (groupId, { firstName, lastName }) => {
    const password = Math.random().toString(36).slice(-8);
    const newStudentData = { firstName, lastName, password };

    const studentDocRef = await addDoc(collection(db, "students"), {
        firstName,
        lastName,
        password
    });

    await setDoc(doc(db, `groups/${groupId}/students`, studentDocRef.id), {
        password 
    });

    return { ...newStudentData, id: studentDocRef.id };
};

export const updateStudent = async (groupId, studentId, { firstName, lastName }) => {
    const studentRef = doc(db, `students`, studentId);
    await updateDoc(studentRef, { firstName, lastName });
};

export const deleteStudent = async (groupId, studentId) => {
    const groupStudentRef = doc(db, `groups/${groupId}/students/${studentId}`);
    await deleteDoc(groupStudentRef);

    const studentRef = doc(db, `students`, studentId);
    await deleteDoc(studentRef);
};

export const getGroups = async (teacherId) => {
  const q = query(groupsCollection, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  const groupPromises = snapshot.docs.map(async (groupDoc) => {
    const groupData = groupDoc.data();
    const students = await getStudentsByGroup(groupDoc.id);
    return { ...groupData, id: groupDoc.id, students };
  });
  return await Promise.all(groupPromises);
};
