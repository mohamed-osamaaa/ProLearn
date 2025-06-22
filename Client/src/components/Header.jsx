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
            className={`flex justify-between items-center flex-wrap fixed h-[90px] text-white w-full px-5 md:px-20 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#1C1E53]/80 backdrop-blur-md'
                : 'bg-[#1C1E53]'
                }`}
        >
            <h1 className='text-3xl font-bold'>ProLearn</h1>

            {user ? (
                <div className='flex flex-wrap gap-2 md:gap-20 items-center mt-1 md:mt-0'>
                    <Link
                        to="/myLectures"
                        className="py-2 md:py-3 text-white font-bold rounded transition flex space-x-1 justify-center items-center px-3"
                    >
                        <span>my</span>
                        <span>Lectures</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className='py-2 md:py-3 text-white font-bold rounded transition border border-white cursor-pointer px-3'
                    >
                        Log out
                    </button>
                </div>
            ) : (
                <div className='flex flex-wrap gap-2 md:gap-10 items-center mt-0'>
                    <Link
                        to="/login"
                        className='py-2 md:py-3 text-white font-bold rounded transition border border-white px-3'
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className='py-2 md:py-3 text-white font-bold rounded transition border border-white px-3'
                    >
                        Register
                    </Link>
                    <div className='flex gap-10 md:gap-20 items-center'></div>
                </div>
            )}
        </div>
    );
}

export default Header;
