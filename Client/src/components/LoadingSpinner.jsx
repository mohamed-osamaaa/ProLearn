import React from 'react';

function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
        </div>
    );
}

export default LoadingSpinner;