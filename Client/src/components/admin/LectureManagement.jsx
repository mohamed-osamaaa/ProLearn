import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit, X, Eye, BookOpen } from 'lucide-react';
import useLectureStore from '../../store/useLectureStore';

const LectureManagement = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSectionsView, setShowSectionsView] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');

    const {
        lectures,
        loading,
        error,
        getLecturesByLevel,
        createLecture,
        updateLecture,
        deleteLecture,
        createSection,
        deleteSection,
        getAllLectures
    } = useLectureStore();


    const [lectureForm, setLectureForm] = useState({
        name: '',
        level: 1,
        price: '',
        description: ''
    });

    const [sectionForm, setSectionForm] = useState({
        lectureId: '',
        name: '',
        image: null,
        video: null
    });

    useEffect(() => {
        fetchLectures();
    }, [selectedLevel]);

    const fetchLectures = async () => {
        if (selectedLevel === 'all') {
            await getAllLectures();
        } else {
            await getLecturesByLevel(parseInt(selectedLevel));
        }
    };

    const handleCreateLecture = async (e) => {
        e.preventDefault();
        const success = await createLecture(lectureForm);
        if (success) {
            setShowCreateModal(false);
            resetLectureForm();
            fetchLectures();
        }
    };

    const handleEditLecture = async (e) => {
        e.preventDefault();
        const success = await updateLecture({
            id: selectedLecture._id,
            ...lectureForm
        });
        if (success) {
            setShowEditModal(false);
            resetLectureForm();
            fetchLectures();
        }
    };

    const handleDeleteLecture = async () => {
        if (deleteTarget) {
            const success = await deleteLecture(deleteTarget.name);
            if (success) {
                setShowDeleteModal(false);
                setDeleteTarget(null);
                fetchLectures();
            }
        }
    };

    const handleCreateSection = async (e) => {
        e.preventDefault();
        try {
            const success = await createSection(sectionForm);
            if (success) {
                setShowSectionModal(false);
                resetSectionForm();
                fetchLectures();
            }
        } catch (error) {
            console.error('Error creating section:', error);
        }
    };


    const handleDeleteSection = async (sectionId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete the section permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const success = await deleteSection(sectionId);
            if (success) {
                fetchLectures();
                Swal.fire('Deleted!', 'The section has been deleted.', 'success');
            } else {
                Swal.fire('Error', 'Something went wrong while deleting.', 'error');
            }
        }
    };

    const resetLectureForm = () => {
        setLectureForm({
            name: '',
            level: 1,
            price: '',
            description: ''
        });
    };

    const resetSectionForm = () => {
        setSectionForm({
            lectureId: '',
            name: '',
            image: null,
            video: null
        });
    };

    const openEditModal = (lecture) => {
        setSelectedLecture(lecture);
        setLectureForm({
            name: lecture.name,
            level: lecture.level,
            price: lecture.price.toString(),
            description: lecture.description || ''
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (lecture) => {
        setDeleteTarget(lecture);
        setShowDeleteModal(true);
    };

    const openSectionModal = (lecture) => {
        setSelectedLecture(lecture);
        setSectionForm({
            lectureId: lecture._id,
            name: '',
            image: null,
            video: null
        });
        setShowSectionModal(true);
    };

    const openSectionsView = (lecture) => {
        setSelectedLecture(lecture);
        setShowSectionsView(true);
    };

    const handleFileChange = (e, type, formType = 'lecture') => {
        const file = e.target.files[0];
        if (formType === 'lecture') {
            setLectureForm(prev => ({ ...prev, [type]: file }));
        } else {
            setSectionForm(prev => ({ ...prev, [type]: file }));
        }
    };

    // Filter lectures based on search and level
    const filteredLectures = lectures.filter(lecture => {
        const matchesSearch = lecture.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = selectedLevel === 'all' || lecture.level === parseInt(selectedLevel);
        return matchesSearch && matchesLevel;
    });

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Lecture Management</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Lecture Management</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 cursor-pointer"
                >
                    <Plus size={16} />
                    Create Lecture
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search lectures..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Levels</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Lectures Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lecture Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sections
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLectures.map((lecture) => (
                            <tr key={lecture._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{lecture.name}</div>
                                    {lecture.description && (
                                        <div className="text-sm text-gray-500">{lecture.description.substring(0, 50)}...</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${lecture.level === 1 ? 'bg-green-100 text-green-800' :
                                        lecture.level === 2 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        Level {lecture.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${lecture.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() => openSectionsView(lecture)}
                                        className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                    >
                                        {lecture.sections?.length || 0} sections
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(lecture)}
                                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                            title="Edit Lecture"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => openSectionModal(lecture)}
                                            className="text-green-600 hover:text-green-900 cursor-pointer"
                                            title="Add Section"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button
                                            onClick={() => openSectionsView(lecture)}
                                            className="text-purple-600 hover:text-purple-900 cursor-pointer"
                                            title="View Sections"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(lecture)}
                                            className="text-red-600 hover:text-red-900 cursor-pointer"
                                            title="Delete Lecture"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLectures.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No lectures found</p>
                    </div>
                )}
            </div>

            {/* Create Lecture Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Create New Lecture</h3>
                            <button onClick={() => setShowCreateModal(false)} className='cursor-pointer'>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateLecture} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lectureForm.name}
                                    onChange={(e) => setLectureForm({ ...lectureForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                <select
                                    value={lectureForm.level}
                                    onChange={(e) => setLectureForm({ ...lectureForm, level: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>Level 1</option>
                                    <option value={2}>Level 2</option>
                                    <option value={3}>Level 3</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    required
                                    value={lectureForm.price}
                                    onChange={(e) => setLectureForm({ ...lectureForm, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={lectureForm.description}
                                    onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Creating...' : 'Create Lecture'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Lecture Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Lecture</h3>
                            <button onClick={() => setShowEditModal(false)} className='cursor-pointer'>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEditLecture} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lectureForm.name}
                                    onChange={(e) => setLectureForm({ ...lectureForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                <select
                                    value={lectureForm.level}
                                    onChange={(e) => setLectureForm({ ...lectureForm, level: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>Level 1</option>
                                    <option value={2}>Level 2</option>
                                    <option value={3}>Level 3</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    required
                                    value={lectureForm.price}
                                    onChange={(e) => setLectureForm({ ...lectureForm, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={lectureForm.description}
                                    onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Updating...' : 'Update Lecture'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Section Modal */}
            {showSectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Add Section to "{selectedLecture?.name}"
                            </h3>
                            <button onClick={() => setShowSectionModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSection} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={sectionForm.name}
                                    onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter section name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'image', 'section')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Optional: Upload an image for this section</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileChange(e, 'video', 'section')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Optional: Upload a video for this section</p>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Creating Section...' : 'Create Section'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSectionModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sections View Modal */}
            {showSectionsView && selectedLecture && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Sections for "{selectedLecture.name}"
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowSectionsView(false);
                                        openSectionModal(selectedLecture);
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={14} />
                                    Add Section
                                </button>
                                <button onClick={() => setShowSectionsView(false)} className='cursor-pointer'>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {selectedLecture.sections && selectedLecture.sections.length > 0 ? (
                            <div className="space-y-4">
                                {selectedLecture.sections.map((section, index) => (
                                    <div key={section._id || index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                                    <BookOpen size={16} />
                                                    {section.name}
                                                </h4>
                                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                    {section.image && <span>📷 Has Image</span>}
                                                    {section.video && <span>🎥 Has Video</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteSection(section._id)}
                                                className="text-red-600 hover:text-red-900 ml-4 cursor-pointer"
                                                title="Delete Section"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">No sections created yet</p>
                                <button
                                    onClick={() => {
                                        setShowSectionsView(false);
                                        openSectionModal(selectedLecture);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto cursor-pointer"
                                >
                                    <Plus size={16} />
                                    Create First Section
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Confirm Delete</h3>
                            <button onClick={() => setShowDeleteModal(false)} className='cursor-pointer'>
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone and will also delete all associated sections.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleDeleteLecture}
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureManagement;