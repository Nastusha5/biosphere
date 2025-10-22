
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from '../firebase';

export const getStudentFromSession = async (uid) => {
  if (!uid) return null;
  const studentRef = doc(db, "students", uid);
  const studentSnap = await getDoc(studentRef);
  if (studentSnap.exists()) {
    return { id: studentSnap.id, ...studentSnap.data() };
  } else {
    return null;
  }
};

export const completeEcosystemForStudent = (studentId, ecosystemId) => {
  const studentRef = doc(db, "students", studentId);
  return setDoc(studentRef, {
    completedEcosystems: arrayUnion(ecosystemId)
  }, { merge: true });
};

export const saveStudentScore = (studentId, ecosystemId, scoreType, score) => {
    if (score < 0) return Promise.resolve(); 
    const studentRef = doc(db, "students", studentId);
    const fieldPath = `scores.${ecosystemId}.${scoreType}`;
    return setDoc(studentRef, {
        scores: {
            [ecosystemId]: {
                [scoreType]: score
            }
        }
    }, { merge: true });
};

export const signOutStudent = () => {
  return signOut(auth);
};
