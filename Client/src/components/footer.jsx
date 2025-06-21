import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#1E2A38] text-white py-36 px-6 md:px-20 mt-36">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h2 className="text-2xl font-bold text-[#00C2FF]">ProLearn</h2>
                    <p className="text-sm text-gray-300 mt-2 w-1/2">
                        Professional Learning Platform to master your skills through structured levels and premium sessions.
                    </p>
                </div>


                <div>
                    <h3 className="font-semibold text-lg mb-3">Explore</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/myLectures" className="hover:text-white">Lectures</Link></li>
                        <li><Link to="/about" className="hover:text-white">About</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-3">Contact</h3>
                    <p className="text-sm text-gray-300">Email: support@prolearn.com</p>
                    <p className="text-sm text-gray-300">Phone: +20 1025926249</p>
                    <p className="text-sm text-gray-300 mt-2">© {new Date().getFullYear()} ProLearn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
