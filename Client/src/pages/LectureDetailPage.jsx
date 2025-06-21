import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLectureStore from '../store/useLectureStore';
import Header from '../components/Header';
import { FiArrowLeft } from 'react-icons/fi';

const LectureDetailPage = () => {
    const { lectureId } = useParams();
    const navigate = useNavigate();
    const [activeSectionId, setActiveSectionId] = useState(null);

    const {
        currentLecture: lecture,
        loading,
        error,
        getLectureById,
        markSectionCompleted
    } = useLectureStore();

    const BASE_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        if (lectureId) getLectureById(lectureId);
    }, [lectureId, getLectureById]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full" />
            </div>
        );
    }

    if (error || !lecture) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Lecture Not Found</h2>
                <p className="text-gray-500">{error || 'No lecture data available.'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { name, description, price, level, sections = [] } = lecture;

    return (
        <>
            <Header />

            <div className="container mx-auto px-4 py-28 max-w-5xl bg-gray-50">
                {/* <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
                >
                    ← Back
                </button> */}

                <div className="relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-[-180px] bg-[#1E3A8A] text-white font-semibold px-4 py-2 rounded border border-white flex items-center gap-2 hover:bg-blue-800 transition duration-200 w-fit"
                    >
                        <FiArrowLeft size={18} />
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-200">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">{name}</h1>
                    {description && <p className="text-gray-600 mb-4">{description}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-3 text-sm text-gray-600 gap-y-2">
                        <span><strong className="text-gray-700">Level:</strong> {level}</span>
                        <span><strong className="text-gray-700">Price:</strong> {price === 0 ? 'Free' : `$${price}`}</span>
                        <span><strong className="text-gray-700">Sections:</strong> {sections.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Course Sections</h2>

                    {sections.length === 0 ? (
                        <p className="text-gray-500 text-center">No sections available.</p>
                    ) : (
                        <div className="space-y-6">
                            {sections.map((section, i) => {
                                const videoUrl = `${BASE_URL}/${section.videoPath}`;
                                const posterUrl = section.imagePath ? `${BASE_URL}/${section.imagePath}` : null;
                                const isActive = activeSectionId === section._id;
                                // { console.log("posterUrl", posterUrl); }

                                return (
                                    <div
                                        key={section._id}
                                        className="border border-gray-300 bg-gray-50 rounded-lg p-4 transition hover:shadow-md"
                                    >
                                        <div
                                            className="flex items-start cursor-pointer"
                                            onClick={() =>
                                                setActiveSectionId(
                                                    isActive ? null : section._id
                                                )
                                            }
                                        >
                                            <div className="w-28 h-20 bg-gray-200 flex items-center justify-center mr-4 rounded overflow-hidden">
                                                {section.imagePath ? (
                                                    <img
                                                        crossorigin="anonymous"
                                                        src={posterUrl}
                                                        alt="thumbnail"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400">No Image</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1 text-lg text-gray-800">
                                                    {i + 1}. {section.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className={section.isCompleted ? 'text-green-600' : 'text-red-500'}>
                                                        {section.isCompleted ? '✅ Completed' : '❌ Not completed'}
                                                    </span>
                                                    {section.videoPath && <span>🎥 Video available</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {isActive && section.videoPath && (
                                            <div className="mt-4 space-y-4">
                                                <video
                                                    controls
                                                    className="w-full max-h-96 bg-black rounded-lg"
                                                    crossorigin="anonymous"
                                                    poster={posterUrl}
                                                >
                                                    <source src={videoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>

                                                {!section.isCompleted && (
                                                    <div className='flex justify-center'>
                                                        <button
                                                            onClick={async () => {
                                                                const result = await markSectionCompleted(lecture._id, section._id);
                                                                if (result) getLectureById(lecture._id); // Refresh lecture to update UI
                                                            }}
                                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                                        >
                                                            ✅ Mark as Completed
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LectureDetailPage;
