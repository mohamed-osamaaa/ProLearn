import React, { useState } from 'react';

import {
    Link,
    useNavigate,
} from 'react-router-dom';

import img1 from '../assets/img1.png';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);
        if (res)
            navigate('/login');
    };

    return (
        <div className="min-h-screen flex">

            <div
                className="w-1/2 bg-cover bg-center relative hidden md:flex items-center justify-center"
                style={{ backgroundImage: `url(${img1})` }}
            >
                <div className="absolute inset-0 bg-[#0e1446]/70"></div>
                <div className="relative z-10 text-white px-10">
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        One Step Closer <br />
                        To Your <br />
                        Dreams
                    </h1>
                    <p className="text-lg opacity-80">
                        A free E-Learning service ready to help <br />
                        you become an expert
                    </p>
                </div>
            </div>


            <div className="w-full md:w-1/2 bg-[#0e1446] flex items-center justify-center">
                <div className="w-full max-w-md px-8">
                    <h2 className="text-white text-3xl font-semibold mb-2">Register</h2>
                    <p className="text-white text-sm mb-6 opacity-70">
                        Join our platform and unlock your full potential
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-yellow-300 text-[#0e1446] font-bold rounded hover:bg-yellow-400 transition cursor-pointer"
                        >
                            {loading ? "Registering..." : "REGISTER"}
                        </button>
                    </form>

                    <p className="text-white text-sm text-center mt-6">
                        Already have an account?{" "}
                        <Link to={"/login"} className="text-white underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
