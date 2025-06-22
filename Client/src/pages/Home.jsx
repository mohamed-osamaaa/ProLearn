import React from 'react';

import Header from '../components/Header';
import Levels from '../components/Levels';
import Footer from '../components/footer';

function Home() {
    return (
        <div>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-screen bg-[#1C1E53] text-white px-4 text-center'>
                <h1 className='text-4xl sm:text-5xl font-bold mb-4'>Welcome to ProLearn</h1>
                <p className='text-lg sm:text-xl mb-8'>Your journey to mastering new skills starts here.</p>
                <button
                    onClick={() => {
                        const element = document.getElementById('levels');
                        if (element) {
                            const yOffset = -150;
                            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                >
                    Get Started
                </button>
            </div>
            <Levels />
            <Footer />
        </div>
    )
}

export default Home;