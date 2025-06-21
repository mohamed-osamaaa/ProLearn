import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { axiosInstance } from '../lib/axios.js';

const useLectureStore = create((set, get) => ({
    lectures: [],
    currentLecture: null,
    currentSection: null,
    purchasedLectures: [],
    loading: false,
    error: null,

    getLecturesByLevel: async (level) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post('/lectures/byLevel', { level });
            set({ lectures: res.data, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch lectures";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    getLevelOneLectures: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/lectures/level/1');
            set({ lectures: res.data.lectures, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch level 1 lectures";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    getLevelTwoLectures: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/lectures/level/2');
            set({ lectures: res.data.lectures, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch level 2 lectures";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    getLevelThreeLectures: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/lectures/level/3');
            set({ lectures: res.data.lectures, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch level 3 lectures";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    getLectureById: async (lectureId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/lectures/${lectureId}`);
            set({ currentLecture: res.data, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch lecture";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    getSectionById: async (sectionId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/lectures/section/${sectionId}`);
            set({ currentSection: res.data, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch section";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    getPurchasedLectures: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get(`/lectures/purchased/${userId}`);
            set({ purchasedLectures: res.data, loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch purchased lectures";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    createLecture: async (lectureData) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();

            Object.keys(lectureData).forEach(key => {
                if (key !== 'image' && key !== 'video') {
                    formData.append(key, lectureData[key]);
                }
            });

            if (lectureData.image) {
                formData.append('image', lectureData.image);
            }
            if (lectureData.video) {
                formData.append('video', lectureData.video);
            }

            const res = await axiosInstance.post('/lectures/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            set({ loading: false });
            toast.success(res.data.message || "Lecture created successfully");

            // Refresh lectures list
            const { lectures } = get();
            set({ lectures: [...lectures, res.data.lecture] });

            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create lecture";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    createSection: async (sectionData) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();

            Object.keys(sectionData).forEach(key => {
                if (key !== 'image' && key !== 'video') {
                    formData.append(key, sectionData[key]);
                }
            });

            if (sectionData.image) {
                formData.append('image', sectionData.image);
            }

            if (sectionData.video) {
                formData.append('video', sectionData.video);
            }

            const res = await axiosInstance.post('/lectures/create/section', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            set({ loading: false });
            toast.success(res.data.message || "Section added successfully");

            // Update lecture in state if currentLecture matches
            const { currentLecture } = get();
            if (currentLecture && currentLecture._id === sectionData.lectureId) {
                set({
                    currentLecture: {
                        ...currentLecture,
                        sections: [...currentLecture.sections, res.data.section],
                    },
                });
            }

            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create section";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    updateLecture: async (lectureData) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.patch('/lectures/update', lectureData);
            set({ loading: false });
            toast.success("Lecture updated successfully");


            const { lectures } = get();
            const updatedLectures = lectures.map(lecture =>
                lecture._id === lectureData.id ? res.data.updated : lecture
            );
            set({ lectures: updatedLectures });

            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to update lecture";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    deleteLecture: async (lectureId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.delete('/lectures/delete', {
                data: { id: lectureId }
            });
            set({ loading: false });
            toast.success(res.data.message || "Lecture deleted successfully");


            const { lectures } = get();
            const filteredLectures = lectures.filter(lecture => lecture._id !== lectureId);
            set({ lectures: filteredLectures });

            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete lecture";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    deleteSection: async (lectureId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.delete('/lectures/section/delete', {
                data: { lectureId }
            });
            set({ loading: false });
            toast.success(res.data.message || "Section deleted successfully");
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete section";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    markSectionCompleted: async (lectureId, sectionId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.patch('/lectures/section/complete', {
                lectureId,
                sectionId
            });
            set({ loading: false });
            toast.success(res.data.message || "Section marked as completed");
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to mark section as completed";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    checkLectureCompleted: async (lectureId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post('/lectures/check/completed', {
                lectureId
            });
            set({ loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to check lecture completion";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    getLectureUsersAndProgress: async (lectureId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post('/lectures/users/progress', {
                lectureId
            });
            set({ loading: false });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch lecture progress";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    createLectureCheckout: async (lectureId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post('/payment', { lectureId });
            set({ loading: false });


            if (res.data.url) {
                window.location.href = res.data.url;
            }

            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create checkout session";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },


    handlePaymentSuccess: async (sessionId) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post(`/payment?session_id=${sessionId}`);
            set({ loading: false });
            toast.success(res.data.message || "Lecture purchased successfully");

            // Refresh purchased lectures
            const userId = res.data.userId;
            if (userId) {
                get().getPurchasedLectures(userId);
            }

            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to process payment";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },
}));

export default useLectureStore;