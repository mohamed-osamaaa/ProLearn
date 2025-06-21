import React, { useEffect } from 'react';

import { Toaster } from 'react-hot-toast';
import {
  Route,
  Routes,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import useAuthStore from './store/useAuthStore';
import Level from './pages/Level';
import LectureDetailPage from './pages/LectureDetailPage';
import MyCourses from './pages/MyCourses';

function App() {
  const { checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);


  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/level/:level" element={<Level />} />
        <Route path="/lectures/:lectureId" element={<LectureDetailPage />} />
        <Route path="/myLectures" element={<MyCourses />} />
      </Routes>
    </>
  );
}

export default App;
