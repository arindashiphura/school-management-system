import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import ViewStudentModal from './ViewStudentModal';
import EditStudentModal from './EditStudentModal';
import LoadingSpinner from './LoadingSpinner';
import { FiEdit, FiTrash2, FiEye, FiCheck, FiX, FiMinus, FiMaximize2 } from 'react-icons/fi';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRoll, setFilterRoll] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Modal state for viewing student
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  // Modal state for editing student
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/students/all');
        setStudents(res.data.students || []);
        setFilteredStudents(res.data.students || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = () => {
    let filtered = students;
    if (filterRoll) {
      filtered = filtered.filter(student =>
        student.rollNo && student.rollNo.toLowerCase().includes(filterRoll.toLowerCase())
      );
    }
    if (filterSection) {
      filtered = filtered.filter(student =>
        student.section && student.section.toLowerCase().includes(filterSection.toLowerCase())
      );
    }
    setFilteredStudents(filtered);
    setSelectedRows([]); // clear selection on new search
  };

  const handleSelectAll = () => {
    setSelectedRows(filteredStudents.map(student => student._id));
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleMasterCheckbox = (e) => {
    if (e.target.checked) {
      handleSelectAll();
    } else {
      handleClearSelection();
    }
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMaximized(true);
  const handleClose = () => setIsClosed(true);

  // Handle save from EditStudentModal (now handles FormData for photo upload)
  const handleEditSave = async (formData, studentId) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/students/${studentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refresh students list after update
      const res = await axios.get('http://localhost:8000/api/v1/students/all');
      setStudents(res.data.students || []);
      setFilteredStudents(res.data.students || []);
    } catch (err) {
      alert('Failed to update student.');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteStudent) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/students/${deleteStudent._id}`);
      // Refresh students list after delete
      const res = await axios.get('http://localhost:8000/api/v1/students/all');
      setStudents(res.data.students || []);
      setFilteredStudents(res.data.students || []);
      setDeleteSuccess(true);
    } catch (err) {
      alert('Failed to delete student.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isClosed) return null;

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Students</span>
          </div>
          <div className={`bg-white rounded-lg shadow-lg max-w-7xl w-full mx-auto p-8 relative ${isMinimized ? 'h-16 overflow-hidden' : ''} ${isMaximized ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}> 
            <h2 className="text-xl font-bold mb-2">All Students</h2>
            <hr className="mb-6 border-gray-200" />
            {/* Filter/Search Bar with Icons */}
            <div className="flex gap-2 mb-4 justify-end items-center bg-gray-50 p-2 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Type Roll No..."
                value={filterRoll}
                onChange={e => setFilterRoll(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Type Section..."
                value={filterSection}
                onChange={e => setFilterSection(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-1 rounded font-semibold shadow hover:bg-blue-700"
              >
                SEARCH
              </button>
              <button title="Minimize" onClick={handleMinimize} className="text-gray-500 hover:text-gray-700 border border-gray-200 rounded p-1"><FiMinus size={18} /></button>
              <button title="Maximize" onClick={handleMaximize} className="text-gray-500 hover:text-gray-700 border border-gray-200 rounded p-1"><FiMaximize2 size={18} /></button>
              <button title="Close" onClick={handleClose} className="text-gray-500 hover:text-gray-700 border border-gray-200 rounded p-1"><FiX size={18} /></button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-2 font-medium text-left"><input type="checkbox" /></th>
                    <th className="px-2 py-2 font-medium text-left">Roll</th>
                    <th className="px-2 py-2 font-medium text-left">Photo</th>
                    <th className="px-2 py-2 font-medium text-left">Name</th>
                    <th className="px-2 py-2 font-medium text-left">Gender</th>
                    <th className="px-2 py-2 font-medium text-left">Parent's Name</th>
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
                    <LoadingSpinner text="Loading students..." />
                  ) : error ? (
                    <tr><td colSpan={13} className="text-center text-red-600 py-8">{error}</td></tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr><td colSpan={13} className="text-center text-gray-500">No students found.</td></tr>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <tr key={student._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 py-2 text-center"><input type="checkbox" checked={selectedRows.includes(student._id)} onChange={() => handleRowSelect(student._id)} /></td>
                        <td
                          className="px-2 py-2 text-blue-600 hover:underline cursor-pointer"
                          onClick={() => {
                            setViewStudent(student);
                            setViewModalOpen(true);
                          }}
                        >
                          {student.rollNo || '-'}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <img
                            src={
                              student.studentPhoto
                                ? student.studentPhoto.startsWith('http')
                                  ? student.studentPhoto
                                  : `http://localhost:8000${student.studentPhoto}`
                                : 'https://ui-avatars.com/api/?name=Student&background=random'
                            }
                            alt="Student"
                            className="w-8 h-8 rounded-full object-cover mx-auto"
                          />
                        </td>
                        <td className="px-2 py-2">{student.firstName} {student.lastName}</td>
                        <td className="px-2 py-2">{student.gender}</td>
                        <td className="px-2 py-2">{student.fatherName || student.parentName || '-'}</td>
                        <td className="px-2 py-2">{student.class}</td>
                        <td className="px-2 py-2">{student.section}</td>
                        <td className="px-2 py-2">{student.presentAddress}</td>
                        <td className="px-2 py-2">{
  student.dob
    ? new Date(student.dob).toLocaleDateString('en-GB')
    : '-'
}</td>
                        <td className="px-2 py-2">{student.phoneNumber}</td>
                        <td className="px-2 py-2">{student.email}</td>
                        <td className="px-2 py-2 flex gap-2 justify-center">
                          <button
                            title="View"
                            className="hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => {
                              setViewStudent(student);
                              setViewModalOpen(true);
                            }}
                          >
                            <FiEye className="text-blue-600 hover:text-blue-800" />
                          </button>
                          <button
                            title="Edit"
                            className="hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => {
                              setEditStudent(student);
                              setEditModalOpen(true);
                            }}
                          >
                            <FiEdit className="text-green-600 hover:text-green-800" />
                          </button>
                          <button
                            title="Delete"
                            className="hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => {
                              setDeleteStudent(student);
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
          </div>
        </div>
      </div>
      <ViewStudentModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        student={viewStudent}
      />
      <EditStudentModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={editStudent}
        onSave={handleEditSave}
        onSuccess={() => {
          setEditModalOpen(false);
        }}
      />
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative text-center">
            <h4 className="text-lg font-bold mb-4 text-red-700">Are you sure you want to delete this student?</h4>
            <div className="mb-4 text-gray-700">{deleteStudent && `${deleteStudent.firstName} ${deleteStudent.lastName} (${deleteStudent.rollNo})`}</div>
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
            <h4 className="text-lg font-bold mb-4 text-green-700">Student deleted successfully!</h4>
            <button
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-2"
              onClick={() => {
                setDeleteSuccess(false);
                setDeleteModalOpen(false);
                setDeleteStudent(null);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudents; 