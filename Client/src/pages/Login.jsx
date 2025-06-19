import React, { useState } from 'react';

import {
    Link,
    useNavigate,
} from 'react-router-dom';

import img1 from '../assets/img1.png';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res)
            navigate('/');
    };

    return (
        <div className="min-h-screen flex">

            <div className="w-1/2 bg-cover bg-center relative hidden md:flex items-center justify-center" style={{ backgroundImage: `url(${img1})` }}>
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
                    <h2 className="text-white text-3xl font-semibold mb-2">Login</h2>
                    <p className="text-white text-sm mb-6 opacity-70">
                        Prepare yourself for a future full of stars
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white placeholder-white/60"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-yellow-300 text-[#0e1446] font-bold rounded hover:bg-yellow-400 transition cursor-pointer"
                        >
                            {loading ? "Logging in..." : "LOGIN"}
                        </button>
                    </form>

                    <p className="text-white text-sm text-center mt-6">
                        Don’t have an account?{" "}
                        <Link to={"/register"} className="text-white underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
