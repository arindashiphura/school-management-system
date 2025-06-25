import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
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

  if (isClosed) return null;

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Students</span>
          </div>
          <div className={`bg-white rounded-lg shadow-lg max-w-7xl w-full mx-auto p-8 relative ${isMinimized ? 'h-16 overflow-hidden' : ''} ${isMaximized ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}> 
            <h2 className="text-xl font-bold mb-2">All Students</h2>
            <hr className="mb-6 border-gray-200" />
            {/* Filter/Search Bar with Icons */}
            <div className="flex gap-2 mb-4 justify-end items-center">
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
                className="bg-blue-600 text-white px-4 py-1 rounded font-semibold"
              >
                SEARCH
              </button>
              <button title="Select All" onClick={handleSelectAll} className="text-green-600"><FiCheck size={18} /></button>
              <button title="Clear Selection" onClick={handleClearSelection} className="text-red-600"><FiX size={18} /></button>
              <button title="Minimize" onClick={handleMinimize} className="text-gray-500"><FiMinus size={18} /></button>
              <button title="Maximize" onClick={handleMaximize} className="text-gray-500"><FiMaximize2 size={18} /></button>
              <button title="Close" onClick={handleClose} className="text-gray-500"><FiX size={18} /></button>
            </div>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 border">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={handleMasterCheckbox}
                        />
                      </th>
                      <th className="px-3 py-2 border">Roll</th>
                      <th className="px-3 py-2 border">Photo</th>
                      <th className="px-3 py-2 border">Name</th>
                      <th className="px-3 py-2 border">Gender</th>
                      <th className="px-3 py-2 border">Parent's Name</th>
                      <th className="px-3 py-2 border">Class</th>
                      <th className="px-3 py-2 border">Section</th>
                      <th className="px-3 py-2 border">Address</th>
                      <th className="px-3 py-2 border">Date of Birth</th>
                      <th className="px-3 py-2 border">Mobile No.</th>
                      <th className="px-3 py-2 border">Email</th>
                      <th className="px-3 py-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, idx) => (
                      <tr key={student._id || idx} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2 border text-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(student._id)}
                            onChange={() => handleRowSelect(student._id)}
                          />
                        </td>
                        <td className="px-3 py-2 border">{student.rollNo || '-'}</td>
                        <td className="px-3 py-2 border">
                          {student.studentPhoto ? (
                            <img src={student.studentPhoto.startsWith('http') ? student.studentPhoto : `http://localhost:8000${student.studentPhoto}`} alt="Student" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <span className="text-gray-400">No Photo</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border">{student.firstName} {student.lastName}</td>
                        <td className="px-3 py-2 border">{student.gender}</td>
                        <td className="px-3 py-2 border">{student.fatherName}</td>
                        <td className="px-3 py-2 border">{student.class}</td>
                        <td className="px-3 py-2 border">{student.section}</td>
                        <td className="px-3 py-2 border">{student.presentAddress}</td>
                        <td className="px-3 py-2 border">{student.dob}</td>
                        <td className="px-3 py-2 border">{student.phoneNumber}</td>
                        <td className="px-3 py-2 border">{student.email}</td>
                        <td className="px-3 py-2 border flex gap-2 justify-center">
                          <button title="View"><FiEye className="text-blue-600 hover:text-blue-800" /></button>
                          <button title="Edit"><FiEdit className="text-green-600 hover:text-green-800" /></button>
                          <button title="Delete"><FiTrash2 className="text-red-600 hover:text-red-800" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudents; 