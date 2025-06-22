import React, { useState } from 'react';
import { Users, BookOpen, BarChart3, Settings, LogOut, Search, Plus, Trash2, Edit } from 'lucide-react';
import useLectureStore from '../../store/useLectureStore';

const UserProgress = () => {
    const [lectureName, setLectureName] = useState('');
    const [progressData, setProgressData] = useState(null);
    const { getLectureUsersAndProgress, loading, error } = useLectureStore();

    const handleSearch = async () => {
        if (!lectureName.trim()) return;

        try {
            const result = await getLectureUsersAndProgress(lectureName);
            if (result) {
                setProgressData(result);
            } else {
                setProgressData(null);
            }
        } catch (err) {
            console.error('Error fetching lecture progress:', err);
            setProgressData(null);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">User Progress</h2>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lecture Name
                        </label>
                        <input
                            type="text"
                            value={lectureName}
                            onChange={(e) => setLectureName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter lecture name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !lectureName.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                        <Search size={16} />
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* No Results Message */}
            {progressData === null && lectureName && !loading && !error && (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <div className="text-gray-500">
                        <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No data found</p>
                        <p className="text-sm">Try searching for a different lecture name.</p>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {progressData && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Purchased</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {progressData.purchasedCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {progressData.completedCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {progressData.purchasedCount > 0
                                            ? Math.round((progressData.completedCount / progressData.purchasedCount) * 100)
                                            : 0}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {(progressData.purchasedCount || 0) - (progressData.completedCount || 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lecture Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Lecture Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Lecture Name</p>
                            <p className="text-lg font-medium text-gray-900">{progressData.lectureName || lectureName}</p>
                        </div>
                    </div>

                    {/* Users Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Purchased Users */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Users Who Purchased ({progressData.usersPurchased?.length || 0})
                            </h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {progressData.usersPurchased && progressData.usersPurchased.length > 0 ? (
                                    progressData.usersPurchased.map((user, index) => (
                                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                                                <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No users have purchased this lecture yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Completed Users */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-green-600" />
                                Users Who Completed ({progressData.usersCompleted?.length || 0})
                            </h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {progressData.usersCompleted && progressData.usersCompleted.length > 0 ? (
                                    progressData.usersCompleted.map((user, index) => (
                                        <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                                                <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No users have completed this lecture yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProgress;