import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function Header() {
    const navigate = useNavigate();

    const { user, logout } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);


    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            // Set isScrolled to true if scroll position is greater than 0
            setIsScrolled(window.scrollY > 0);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`flex justify-between items-center fixed h-[90px] text-white w-full px-20 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#1C1E53]/80 backdrop-blur-md'
                : 'bg-[#1C1E53]'
                }`}
        >
            <h1 className='text-3xl font-bold'>ProLearn</h1>

            {user ? (
                <div className='flex gap-20 items-center'>
                    <Link
                        to="/myLectures"
                        className="w-full py-3 text-white font-bold rounded transition flex space-x-2 justify-center items-center px-3"
                    >
                        <span>My</span>
                        <span>Lectures</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className='w-full py-3 text-white font-bold rounded transition border border-white cursor-pointer px-3'
                    >
                        Log out
                    </button>
                </div>
            ) : (
                <div className='flex gap-10 items-center'>
                    <Link
                        to="/login"
                        className='w-full py-3 text-white font-bold rounded transition border border-white px-3'
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className='w-full py-3 text-white font-bold rounded transition border border-white px-3'
                    >
                        Register
                    </Link>
                    <div className='flex gap-20 items-center'></div>
                </div>
            )}
        </div>
    );
}

export default Header;