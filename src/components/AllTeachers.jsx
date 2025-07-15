import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';
import EditTeacherModal from './EditTeacherModal';
import LoadingSpinner from './LoadingSpinner';

const placeholderPhoto = 'https://ui-avatars.com/api/?name=Teacher&background=random';

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [viewTeacher, setViewTeacher] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTeacher, setDeleteTeacher] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/teachers');
      setTeachers(res.data.teachers || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch teachers.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (formData, teacherId) => {
    setEditLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/v1/teachers/${teacherId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditSuccess(true);
      await fetchTeachers();
    } catch (err) {
      alert('Failed to update teacher.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTeacher) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/teachers/${deleteTeacher._id}`);
      setDeleteSuccess(true);
      await fetchTeachers();
    } catch (err) {
      alert('Failed to delete teacher.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    (!searchName || teacher.name?.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchClass || teacher.class?.toLowerCase().includes(searchClass.toLowerCase()))
  );

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Teachers List</span>
          </div>
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg px-8 pt-8 pb-12 mx-auto mt-4">
            <h2 className="text-lg font-semibold mb-4">All Teachers</h2>
            {/* Search Bar */}
            <div className="flex justify-end items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Type name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 180 }}
              />
              <input
                type="text"
                placeholder="Type class..."
                value={searchClass}
                onChange={e => setSearchClass(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 140 }}
              />
              <button className="bg-blue-600 text-white px-4 py-1 rounded font-semibold flex items-center gap-1">
                <FiSearch /> SEARCH
              </button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-2 font-medium text-left"><input type="checkbox" /></th>
                    <th className="px-2 py-2 font-medium text-left">ID No.</th>
                    <th className="px-2 py-2 font-medium text-left">Photo</th>
                    <th className="px-2 py-2 font-medium text-left">Name</th>
                    <th className="px-2 py-2 font-medium text-left">Gender</th>
                    <th className="px-2 py-2 font-medium text-left">Subject</th>
                    <th className="px-2 py-2 font-medium text-left">Class</th>
                    <th className="px-2 py-2 font-medium text-left">Section</th>
                    <th className="px-2 py-2 font-medium text-left">Address</th>
                    <th className="px-2 py-2 font-medium text-left">Date of Birth</th>
                    <th className="px-2 py-2 font-medium text-left">Mobile No.</th>
                    <th className="px-2 py-2 font-medium text-left">Email</th>
                    <th className="px-2 py-2 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <LoadingSpinner text="Loading teachers..." />
                  ) : error ? (
                    <tr><td colSpan={13} className="text-center text-red-600 py-8">{error}</td></tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr><td colSpan={13} className="text-center text-gray-500">No teachers found.</td></tr>
                  ) : (
                    filteredTeachers.map((teacher, idx) => (
                      <tr key={teacher._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 py-2 text-center"><input type="checkbox" /></td>
                        <td className="px-2 py-2"># {teacher.teacherId || idx + 1}</td>
                        <td className="px-2 py-2 text-center">
                          <img
                            src={
                              teacher.photo
                                ? teacher.photo.startsWith('http')
                                  ? teacher.photo
                                  : `http://localhost:8000${teacher.photo}`
                                : placeholderPhoto
                            }
                            alt="Teacher"
                            className="w-8 h-8 rounded-full object-cover mx-auto"
                          />
                        </td>
                        <td className="px-2 py-2 capitalize">{teacher.name}</td>
                        <td className="px-2 py-2">{teacher.gender}</td>
                        <td className="px-2 py-2">{teacher.subject}</td>
                        <td className="px-2 py-2">{teacher.class}</td>
                        <td className="px-2 py-2">{teacher.section}</td>
                        <td className="px-2 py-2">{teacher.address}</td>
                        <td className="px-2 py-2">
                          {teacher.dob
                            ? new Date(teacher.dob).toLocaleDateString('en-GB')
                            : '-'}
                        </td>
                        <td className="px-2 py-2">{teacher.mobile}</td>
                        <td className="px-2 py-2">{teacher.email}</td>
                        <td className="px-2 py-2 flex gap-2 justify-center">
                          <button title="View" onClick={() => setViewTeacher(teacher)}><FiEye className="text-blue-600 hover:text-blue-800" /></button>
                          <button
                            title="Edit"
                            onClick={() => {
                              setEditTeacher(teacher);
                              setEditModalOpen(true);
                            }}
                          >
                            <FiEdit2 className="text-green-600 hover:text-green-800" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => {
                              setDeleteTeacher(teacher);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <FiTrash2 className="text-red-600 hover:text-red-800" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Modal for viewing teacher details */}
            {viewTeacher && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => setViewTeacher(null)}
                    title="Close"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        viewTeacher.photo
                          ? viewTeacher.photo.startsWith('http')
                            ? viewTeacher.photo
                            : `http://localhost:8000${viewTeacher.photo}`
                          : placeholderPhoto
                      }
                      alt="Teacher"
                      className="w-24 h-24 rounded-full object-cover mb-4 border"
                    />
                    <h3 className="text-xl font-semibold mb-2">{viewTeacher.name}</h3>
                    <div className="w-full grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">ID No.:</span> {viewTeacher.teacherId}</div>
                      <div><span className="font-semibold">Gender:</span> {viewTeacher.gender}</div>
                      <div><span className="font-semibold">Subject:</span> {viewTeacher.subject}</div>
                      <div><span className="font-semibold">Class:</span> {viewTeacher.class}</div>
                      <div><span className="font-semibold">Section:</span> {viewTeacher.section}</div>
                      <div><span className="font-semibold">Address:</span> {viewTeacher.address}</div>
                      <div><span className="font-semibold">Date of Birth:</span> {viewTeacher.dob ? new Date(viewTeacher.dob).toLocaleDateString('en-GB') : '-'}</div>
                      <div><span className="font-semibold">Mobile No.:</span> {viewTeacher.mobile}</div>
                      <div><span className="font-semibold">Email:</span> {viewTeacher.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Edit Modal */}
            <EditTeacherModal
              open={editModalOpen}
              onClose={() => {
                setEditModalOpen(false);
                setEditTeacher(null);
              }}
              teacher={editTeacher}
              onSave={handleEditSave}
            />
            {/* Edit Success Modal */}
            {editSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                  <h4 className="text-lg font-bold mb-4 text-green-700">Teacher updated successfully!</h4>
                  <button
                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-2"
                    onClick={() => {
                      setEditSuccess(false);
                      setEditModalOpen(false);
                      setEditTeacher(null);
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative text-center">
                  <h4 className="text-lg font-bold mb-4 text-red-700">Are you sure you want to delete this teacher?</h4>
                  <div className="mb-4 text-gray-700">{deleteTeacher && `${deleteTeacher.name} (${deleteTeacher.teacherId})`}</div>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                      onClick={() => setDeleteModalOpen(false)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Delete Success Modal */}
            {deleteSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                  <h4 className="text-lg font-bold mb-4 text-green-700">Teacher deleted successfully!</h4>
                  <button
                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-2"
                    onClick={() => {
                      setDeleteSuccess(false);
                      setDeleteModalOpen(false);
                      setDeleteTeacher(null);
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTeachers; 