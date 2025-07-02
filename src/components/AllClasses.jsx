import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiMinus, FiMaximize2, FiX, FiSearch } from 'react-icons/fi';

const placeholderPhoto = 'https://ui-avatars.com/api/?name=Teacher&background=random';

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchSubject, setSearchSubject] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/classes');
      setClasses(res.data.classes || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch classes.');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Search functionality can be implemented here if needed
    // Currently filtering happens in real-time via filteredClasses
  };

  const handleEdit = (classId) => {
    // Implement edit functionality
    console.log('Edit class:', classId);
  };

  const handleDelete = (classId) => {
    // Implement delete functionality
    console.log('Delete class:', classId);
  };

  // Filter classes based on search criteria
  const filteredClasses = classes.filter(cls =>
    (!searchName || cls.teacherName?.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchSubject || cls.subject?.toLowerCase().includes(searchSubject.toLowerCase()))
  );

  const renderTableHeader = () => (
    <thead>
      <tr className="bg-gray-100">
        <th className="px-2 py-2 font-medium text-left">
          <input type="checkbox" />
        </th>
        <th className="px-2 py-2 font-medium text-left">No.</th>
        <th className="px-2 py-2 font-medium text-left">Photo</th>
        <th className="px-2 py-2 font-medium text-left">Teacher Name</th>
        <th className="px-2 py-2 font-medium text-left">Gender</th>
        <th className="px-2 py-2 font-medium text-left">Subject</th>
        <th className="px-2 py-2 font-medium text-left">Class</th>
        <th className="px-2 py-2 font-medium text-left">Section</th>
        <th className="px-2 py-2 font-medium text-left">Date</th>
        <th className="px-2 py-2 font-medium text-left">Timings</th>
        <th className="px-2 py-2 font-medium text-left">Action</th>
      </tr>
    </thead>
  );

  const renderTableRow = (cls, idx) => (
    <tr key={cls._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-2 py-2 text-center">
        <input type="checkbox" />
      </td>
      <td className="px-2 py-2"># {cls.classId || idx + 1}</td>
      <td className="px-2 py-2 text-center">
        <img 
          src={cls.photo || placeholderPhoto} 
          alt="Teacher" 
          className="w-8 h-8 rounded-full object-cover mx-auto" 
        />
      </td>
      <td className="px-2 py-2">{cls.teacherName}</td>
      <td className="px-2 py-2">{cls.gender}</td>
      <td className="px-2 py-2">{cls.subject}</td>
      <td className="px-2 py-2">{cls.class}</td>
      <td className="px-2 py-2">{cls.section}</td>
      <td className="px-2 py-2">{cls.date}</td>
      <td className="px-2 py-2">{cls.timings}</td>
      <td className="px-2 py-2">
        <div className="flex gap-2 justify-center">
          <button 
            title="Edit" 
            onClick={() => handleEdit(cls._id)}
            className="hover:scale-110 transition-transform"
          >
            <FiEdit2 className="text-green-600 hover:text-green-800" />
          </button>
          <button 
            title="Delete" 
            onClick={() => handleDelete(cls._id)}
            className="hover:scale-110 transition-transform"
          >
            <FiTrash2 className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderTableBody = () => (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={11} className="text-center py-8">Loading...</td>
        </tr>
      ) : error ? (
        <tr>
          <td colSpan={11} className="text-center text-red-600 py-8">{error}</td>
        </tr>
      ) : filteredClasses.length === 0 ? (
        <tr>
          <td colSpan={11} className="text-center text-gray-500 py-8">No classes found.</td>
        </tr>
      ) : (
        filteredClasses.map((cls, idx) => renderTableRow(cls, idx))
      )}
    </tbody>
  );

  const renderSearchBar = () => (
    <div className="flex justify-end items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Type teacher name..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ minWidth: 180 }}
      />
      <input
        type="text"
        placeholder="Type subject..."
        value={searchSubject}
        onChange={(e) => setSearchSubject(e.target.value)}
        className="border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ minWidth: 140 }}
      />
      <button 
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-1 rounded font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors"
      >
        <FiSearch />
        SEARCH
      </button>
    </div>
  );

  const renderWindowControls = () => (
    <div className="flex gap-2">
      <button 
        title="Minimize" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiMinus size={16} />
      </button>
      <button 
        title="Maximize" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiMaximize2 size={16} />
      </button>
      <button 
        title="Close" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiX size={16} />
      </button>
    </div>
  );

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Classes</span>
          </div>
          
          {/* Main Content Card */}
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg relative px-8 pt-8 pb-12 mx-auto">
            {/* Header with breadcrumb and window controls */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-500">
              </div>
              {renderWindowControls()}
            </div>
            
            {/* Page Title */}
            <h2 className="text-lg font-semibold mb-4 mt-6">All Classes Schedule</h2>
            
            {/* Search Bar */}
            {renderSearchBar()}
            
            {/* Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                {renderTableHeader()}
                {renderTableBody()}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllClasses;