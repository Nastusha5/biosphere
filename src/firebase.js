
      import { initializeApp } from "firebase/app";
      import { getFirestore } from "firebase/firestore";
      import { getAuth } from "firebase/auth";
      import { getDatabase } from "firebase/database";
      import { getMessages, sendMessage } from "./api/chatApi";
      import { completeEcosystemForStudent, getStudentFromSession, saveStudentScore, signOutStudent } from "./api/studentApi";

      const firebaseConfig = {
        apiKey: "AIzaSyDHbCQWcBGkaOej24gkKpehM9F3poLnf2Q",
        authDomain: "osvitapro-2fc46.firebaseapp.com",
        databaseURL: "https://osvitapro-2fc46-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "osvitapro-2fc46",
        storageBucket: "osvitapro-2fc46.appspot.com",
        messagingSenderId: "400821211823",
        appId: "1:400821211823:web:28fc30b509c005b0ba3a5a",
      };

      const app = initializeApp(firebaseConfig);
      export const db = getFirestore(app);
      export const auth = getAuth(app);
      export const database = getDatabase(app);
      export { getMessages, sendMessage, completeEcosystemForStudent, getStudentFromSession, saveStudentScore, signOutStudent };
