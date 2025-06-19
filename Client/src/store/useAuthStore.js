import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { axiosInstance } from '../lib/axios.js';

const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            set({ user: res.data.data, loading: false });
            toast.success("Login successful");
            return true;
        } catch (error) {
            const response = error?.response?.data;

            if (response?.errors && Array.isArray(response.errors)) {
                const shownMessages = new Set();
                response.errors.forEach((err) => {
                    const msg = `${err.path}: ${err.msg}`;
                    if (!shownMessages.has(msg)) {
                        toast.error(msg);
                        shownMessages.add(msg);
                    }
                });
            } else {
                toast.error(response?.message || "Login failed");
            }
            return false;
        } finally {
            set({ loading: false });
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post('/auth/register', userData);
            set({ user: res.data.data, loading: false });
            toast.success("Account created successfully");
            return true;
        } catch (error) {
            const response = error?.response?.data;

            if (response?.errors && Array.isArray(response.errors)) {
                const shownMessages = new Set();
                response.errors.forEach((err) => {
                    const msg = `${err.path}: ${err.msg}`;
                    if (!shownMessages.has(msg)) {
                        toast.error(msg);
                        shownMessages.add(msg);
                    }
                });
            } else {
                toast.error(response?.message || "Registration failed");
            }

            return false;
        } finally {
            set({ loading: false });
        }
    },

    checkAuth: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/auth/check-auth');
            set({ user: res.data.data, loading: false });
        } catch (err) {
            set({ user: null, loading: false });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await axiosInstance.post('/auth/logout');
            set({ user: null, loading: false });
            toast.success("Logged out successfully");
        } catch (err) {
            set({ error: "Logout failed", loading: false });
            toast.error("Logout failed");
        } finally {
            set({ loading: false });
        }
    },
}));

export default useAuthStore;
