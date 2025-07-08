import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const AllSubjects = ({ subjects, loading, error }) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [viewSubject, setViewSubject] = useState(null);

  const filteredSubjects = subjects.filter(subject =>
    (!searchCode || subject.subjectCode?.toLowerCase().includes(searchCode.toLowerCase())) &&
    (!searchClass || subject.class?.toLowerCase().includes(searchClass.toLowerCase()))
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg px-8 pt-8 pb-12">
      <h2 className="text-lg font-semibold mb-4">All Classes Schedule</h2>
      {/* Search Bar */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Type Code here..."
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
          style={{ minWidth: 140 }}
        />
        <input
          type="text"
          placeholder="Type Class..."
          value={searchClass}
          onChange={e => setSearchClass(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
          style={{ minWidth: 120 }}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded font-semibold flex items-center gap-1">
          <FiSearch /> SEARCH
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-base font-bold">
              <th className="px-2 py-2 font-bold text-left w-8 align-middle whitespace-nowrap"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Subject Code
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Subject Name
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Subject Type
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Class
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center text-red-600 py-8">{error}</td></tr>
            ) : filteredSubjects.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-500">No subjects found.</td></tr>
            ) : (
              filteredSubjects.map((subject, idx) => (
                <tr key={subject._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-2 text-center"><input type="checkbox" /></td>
                  <td className="px-2 py-2 whitespace-nowrap"># {subject.subjectCode}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{subject.subjectName}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{subject.subjectType}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{subject.class}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button title="View" onClick={() => setViewSubject(subject)} className="p-1 rounded hover:bg-blue-50 transition"><FiEye className="text-blue-600 hover:text-blue-800" size={18} /></button>
                      <button title="Edit" className="p-1 rounded hover:bg-green-50 transition"><FiEdit2 className="text-green-600 hover:text-green-800" size={18} /></button>
                      <button title="Delete" className="p-1 rounded hover:bg-red-50 transition"><FiTrash2 className="text-red-600 hover:text-red-800" size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing subject details */}
      {viewSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setViewSubject(null)}
              title="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">{viewSubject.subjectName}</h3>
              <div className="w-full grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Subject Code:</span> {viewSubject.subjectCode}</div>
                <div><span className="font-semibold">Subject Type:</span> {viewSubject.subjectType}</div>
                <div><span className="font-semibold">Class:</span> {viewSubject.class}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubjects; 