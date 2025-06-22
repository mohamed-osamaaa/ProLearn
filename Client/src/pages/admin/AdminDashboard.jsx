import { Routes, Route } from 'react-router-dom';
import UserProgress from '../../components/admin/UserProgress';
import LectureManagement from '../../components/admin/LectureManagement';
import Analytics from '../../components/admin/Analytics';
import Sidebar from '../../components/admin/Sidebar';
import React, { useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';

const AdminDashboard = () => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto p-4">
                <Routes>
                    <Route index element={<UserProgress />} />
                    <Route path="lectures" element={<LectureManagement />} />
                    <Route path="analytics" element={<Analytics />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;