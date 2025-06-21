import React, { useEffect } from 'react';
import useLectureStore from '../store/useLectureStore';
import Header from '../components/Header';
import LectureCard from '../components/LectureCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function MyCourses() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        purchasedLectures,
        loading,
        error,
        getPurchasedLectures
    } = useLectureStore();

    useEffect(() => {
        if (user?.id) {
            getPurchasedLectures(user.id);
        }
    }, [user]);

    if (loading) {
        return (
            <>
                <Header />
                <LoadingSpinner />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="text-red-500 text-xl mb-4">Error: {error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mx-16">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-4 left-0 bg-[#1E3A8A] text-white font-semibold px-4 py-2 rounded border border-white flex items-center gap-2 hover:bg-blue-800 transition duration-200 w-fit"
                        >
                            <FiArrowLeft size={18} />
                            Back
                        </button>
                    </div>

                    <div className="text-center mb-16 mt-16">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-[80px]">
                            🎓 My Courses
                        </h1>
                        <p className="text-gray-600 text-lg">
                            View all the courses you have purchased or enrolled in.
                        </p>
                    </div>

                    {purchasedLectures.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-xl mb-4">
                                You haven’t enrolled in any courses yet.
                            </div>
                            <p className="text-gray-400">Start learning today by browsing our courses!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {purchasedLectures.map((lecture) => (
                                <LectureCard key={lecture._id} lecture={lecture} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyCourses;
