
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const groupsCollection = collection(db, 'groups');

export const getGroupsByTeacher = async (teacherId) => {
  const q = query(groupsCollection, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getStudentsByGroup = async (groupId) => {
    const studentsCollection = collection(db, `groups/${groupId}/students`);
    const studentsSnapshot = await getDocs(studentsCollection);
    return studentsSnapshot.docs.map(studentDoc => ({ ...studentDoc.data(), id: studentDoc.id }));
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
    const studentsCollection = collection(db, `groups/${groupId}/students`);
    const password = Math.random().toString(36).slice(-8);
    const newStudent = { firstName, lastName, password };
    const docRef = await addDoc(studentsCollection, newStudent);
    return { ...newStudent, id: docRef.id };
};

export const updateStudent = async (groupId, studentId, { firstName, lastName }) => {
    const studentRef = doc(db, `groups/${groupId}/students/${studentId}`);
    await updateDoc(studentRef, { firstName, lastName });
};

export const deleteStudent = async (groupId, studentId) => {
    const studentRef = doc(db, `groups/${groupId}/students/${studentId}`);
    await deleteDoc(studentRef);
};

export const getGroups = async (teacherId) => {
  const q = query(groupsCollection, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  const groups = [];
  for (const groupDoc of snapshot.docs) {
    const groupData = groupDoc.data();
    const studentsCollection = collection(db, `groups/${groupDoc.id}/students`);
    const studentsSnapshot = await getDocs(studentsCollection);
    const students = studentsSnapshot.docs.map(studentDoc => ({ ...studentDoc.data(), id: studentDoc.id }));
    groups.push({ ...groupData, id: groupDoc.id, students });
  }
  return groups;
};
