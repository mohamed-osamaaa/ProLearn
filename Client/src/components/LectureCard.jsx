import React from 'react';
import useLectureStore from '../store/useLectureStore';
import level1Img from '../assets/img3.png';
import { useNavigate } from 'react-router-dom';

function LectureCard({ lecture }) {
    const navigate = useNavigate();
    const { createLectureCheckout, purchasedLectures } = useLectureStore();

    const isFree = lecture.price === 0;
    const isPurchased = purchasedLectures.some((p) => p._id === lecture._id);

    const handlePurchase = async (e) => {
        e.stopPropagation();
        if (isFree || isPurchased) {
            navigate(`/lectures/${lecture._id}`);
        } else {
            await createLectureCheckout(lecture._id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="h-48 bg-[#1E3A8A] flex items-center justify-center">
                <img
                    src={level1Img}
                    alt="lectureImage"
                    className="h-full object-contain"
                />
            </div>

            <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {lecture.name}
                </h4>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {lecture.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                        {isFree ? 'Free' : `$${lecture.price}`}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        Level {lecture.level}
                    </span>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handlePurchase}
                        className={`flex-1 px-4 py-2 rounded-md transition-colors
                            ${isFree || isPurchased
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isFree || isPurchased ? 'View Details' : 'Purchase'}
                    </button>
                </div>

                {lecture.sections && (
                    <div className="mt-3 text-sm text-gray-500">
                        {lecture.sections.length} section{lecture.sections.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LectureCard;