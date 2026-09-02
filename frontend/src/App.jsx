import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Feed from './pages/Feed.jsx';
import Navbar from './components/Layout/Navbar';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  return (
    <>
      {isAuth && <Navbar setIsAuth={setIsAuth} />}
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to="/feed" /> : <Login setIsAuth={setIsAuth} />} />
        <Route path="/signup" element={isAuth ? <Navigate to="/feed" /> : <Signup />} />
        <Route path="/feed" element={isAuth ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuth ? "/feed" : "/login"} />} />
      </Routes>
  </>
  );
}

export default App;