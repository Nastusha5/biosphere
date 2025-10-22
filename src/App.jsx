
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import Header from "./components/Header/Header";
import LoginModal from "./components/LoginModal/LoginModal";
import HomePage from "./pages/HomePage";
import TeacherCabinet from "./pages/TeacherCabinet/TeacherCabinet";
import StudentGame from "./pages/StudentGame/StudentGame";
import { auth, db } from "./firebase";
import "./App.css";

const AppWrapper = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(() => {
    const savedStudent = sessionStorage.getItem('currentStudent');
    return savedStudent ? JSON.parse(savedStudent) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentStudent) {
      sessionStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    } else {
      sessionStorage.removeItem('currentStudent');
    }
  }, [currentStudent]);

  useEffect(() => {
    if (currentStudent?.id) {
      const studentDocRef = doc(db, "students", currentStudent.id);
      const unsubscribe = onSnapshot(studentDocRef, (doc) => {
        if (doc.exists()) {
          const updatedData = { id: doc.id, ...doc.data() };
          setCurrentStudent(updatedData);
        }
      });
      return () => unsubscribe();
    }
  }, [currentStudent?.id]);

  const handleLoginClick = () => {
    setLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setLoginOpen(false);
  };

  const handleLogin = (user) => {
    setLoginOpen(false);
    if (user.uid) { 
      navigate('/teacher/dashboard');
    } else { 
      setCurrentStudent(user);
      navigate(`/student-game/${user.id}`);
    }
  };

  const handleTeacherLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
    });
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    navigate('/');
  };

  const showHeader = !location.pathname.startsWith('/teacher') && !location.pathname.startsWith('/student-game');

  return (
    <div className="app">
      {showHeader && (
        <Header
          onLoginClick={handleLoginClick}
          currentUser={currentUser}
          onLogout={handleTeacherLogout}
        />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teacher/*" element={<TeacherCabinet onLogout={handleTeacherLogout} user={currentUser} />} />
        <Route 
          path="/student-game/:studentId" 
          element={
            <StudentGame 
              user={currentStudent} 
              onLogout={handleStudentLogout}
            />
          } 
        />
      </Routes>
      {isLoginOpen && (
        <LoginModal onClose={handleCloseLogin} onLogin={handleLogin} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
