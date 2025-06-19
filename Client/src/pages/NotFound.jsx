import React from 'react';

import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='flex justify-center items-start h-screen mt-[50px]'>
            <div className='text-center'>
                <h1 className='text-[170px] font-bold'><span className='text-[#FCD980]'>4</span><span className='text-[#232536]'>0</span><span className='text-[#FCD980]'>4</span></h1>
                <p className='text-4xl text-[#232536]'>Page Not Found</p>
                <p className='text-[#535353] mt-2'>The page you are looking for does not exist.</p>
                <button className='bg-[#FCD980] text-[#282938] px-4 py-2 rounded mt-6 hover:bg-[#e0c16b] transition duration-300 mt-[40px]'>
                    <Link to="/">Home page</Link>
                </button>
            </div>
        </div>
    )
}

export default NotFound