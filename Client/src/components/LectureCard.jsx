import React, { useEffect } from 'react';
import useLectureStore from '../store/useLectureStore';
import level1Img from '../assets/img3.png';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
// import { axiosInstance } from '../lib/axios';

function LectureCard({ lecture }) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { createLectureCheckout, purchasedLectures } = useLectureStore();

    const isFree = lecture.price === 0;
    const isPurchased = purchasedLectures.some((p) => p._id === lecture._id);

    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    const handlePurchase = async (e) => {
        // For example, if the LectureCard has an onClick and this button is inside it,
        // stopPropagation prevents the click event from reaching the card.
        // This helps avoid accidentally opening the lecture details when clicking the purchase button.
        e.stopPropagation();// Prevents the click event from bubbling up to parent elements (e.g., LectureCard onClick)
        // if (!user) {
        //     navigate('/login');
        //     return;
        // }
        if (isFree || isPurchased) {
            navigate(`/lectures/${lecture._id}`);
        } else {
            console.log("LectureCard:", lecture);
            await createLectureCheckout(lecture._id);
        }
    };
    // const location = useLocation();

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     const sessionId = params.get('session_id');

    //     if (sessionId) {
    //         axiosInstance
    //             .get(`/api/payment/create-checkout-session?session_id=${sessionId}`)
    //             .then(res => {
    //                 console.log(res.data.message);
    //             })
    //             .catch(err => {
    //                 console.error("Failed to verify payment:", err.response?.data?.message);
    //             });
    //     }
    // }, [location]);

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
                        className={`flex-1 px-4 py-2 rounded-md transition-colors cursor-pointer
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