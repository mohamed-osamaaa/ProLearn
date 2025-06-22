import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import useLectureStore from '../../store/useLectureStore';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        totalLectures: 0,
        totalUsers: 0,
        totalRevenue: 0,
        purchasedLectures: 0,
        completedLectures: 0,
        levelBreakdown: { level1: 0, level2: 0, level3: 0 }
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        getLecturesByLevel,
        getLectureUsersAndProgress
    } = useLectureStore();

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [level1Data, level2Data, level3Data] = await Promise.all([
                getLecturesByLevel(1),
                getLecturesByLevel(2),
                getLecturesByLevel(3)
            ]);


            const allLectures = [...(level1Data || []), ...(level2Data || []), ...(level3Data || [])];
            const totalLectures = allLectures.length;


            const levelBreakdown = {
                level1: level1Data?.length || 0,
                level2: level2Data?.length || 0,
                level3: level3Data?.length || 0
            };

            let totalRevenue = 0;
            let totalPurchased = 0;
            let totalCompleted = 0;
            const uniqueUsers = new Set();

            for (const lecture of allLectures) {
                try {
                    const progressData = await getLectureUsersAndProgress(lecture.name);
                    if (progressData) {
                        const purchasedCount = progressData.purchasedCount || 0;
                        const completedCount = progressData.completedCount || 0;
                        const price = lecture.price || 0;

                        totalRevenue += price * purchasedCount;
                        totalPurchased += purchasedCount;
                        totalCompleted += completedCount;

                        if (progressData.usersPurchased) {
                            progressData.usersPurchased.forEach(user => uniqueUsers.add(user.email));
                        }

                        console.log(`Revenue so far: ${totalRevenue}`);
                    }
                } catch (err) {
                    console.error(`Error fetching progress for ${lecture.name}:`, err);
                }
            }

            setAnalyticsData({
                totalLectures,
                totalUsers: uniqueUsers.size,
                totalRevenue,
                purchasedLectures: totalPurchased,
                completedLectures: totalCompleted,
                levelBreakdown
            });

        } catch (err) {
            setError('Failed to fetch analytics data');
            console.error('Analytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    const completionRate = analyticsData.purchasedLectures > 0
        ? Math.round((analyticsData.completedLectures / analyticsData.purchasedLectures) * 100)
        : 0;

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchAnalyticsData}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <button
                    onClick={fetchAnalyticsData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
                >
                    <BarChart3 size={16} />
                    Refresh Data
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Total Lectures</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{analyticsData.totalLectures}</p>
                        </div>
                        <BookOpen className="text-blue-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">{analyticsData.totalUsers}</p>
                        </div>
                        <Users className="text-green-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">${analyticsData.totalRevenue}</p>
                        </div>
                        <DollarSign className="text-purple-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
                            <p className="text-3xl font-bold text-orange-600 mt-2">{completionRate}%</p>
                        </div>
                        <TrendingUp className="text-orange-600" size={24} />
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Lectures by Level</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <span className="text-gray-600">Level 1 (Beginner):</span>
                            <span className="font-medium text-green-600">{analyticsData.levelBreakdown.level1}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                            <span className="text-gray-600">Level 2 (Intermediate):</span>
                            <span className="font-medium text-yellow-600">{analyticsData.levelBreakdown.level2}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                            <span className="text-gray-600">Level 3 (Advanced):</span>
                            <span className="font-medium text-red-600">{analyticsData.levelBreakdown.level3}</span>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Purchase & Completion Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                            <span className="text-gray-600">Total Purchases:</span>
                            <span className="font-medium text-blue-600">{analyticsData.purchasedLectures}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                            <span className="text-gray-600">Total Completions:</span>
                            <span className="font-medium text-purple-600">{analyticsData.completedLectures}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-gray-600">Pending Completions:</span>
                            <span className="font-medium text-gray-600">
                                {analyticsData.purchasedLectures - analyticsData.completedLectures}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;