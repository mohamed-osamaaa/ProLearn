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
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { checkAuth } = useAuthStore();

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
        <Route path="/level/:level" element={<Level />} />
        <Route path="/lectures/:lectureId" element={<LectureDetailPage />} />
        <Route path="*" element={<NotFound />} />


        <Route element={<ProtectedRoute />}>
          <Route path="/myLectures" element={<MyCourses />} />
        </Route>


        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
