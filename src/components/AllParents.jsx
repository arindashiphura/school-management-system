import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';

const placeholderPhoto = 'https://ui-avatars.com/api/?name=Parent&background=random';

const AllParents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/parents');
      setParents(res.data.parents || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch parents.');
    } finally {
      setLoading(false);
    }
  };

  const filteredParents = parents.filter(parent =>
    (!searchName || parent.name?.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchMobile || parent.mobile?.toLowerCase().includes(searchMobile.toLowerCase()))
  );

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Parents List</span>
          </div>
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          

          <div className="flex justify-between items-center mb-4 bg-white   overflow-x-auto" >
            <h1 className="text-xl font-semibold text-gray-800">All Parents</h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded text-sm shadow-sm"
              />
              <input
                type="text"
                placeholder="Type mobile no..."
                value={searchMobile}
                onChange={e => setSearchMobile(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded text-sm shadow-sm"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-1 shadow-sm">
                <FiSearch /> Search
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3"><input type="checkbox" /></th>
                  <th className="p-3">ID No.</th>
                  <th className="p-3">Photo</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Occupation</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Mobile No.</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} className="text-center py-8">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan={10} className="text-center text-red-600 py-8">{error}</td></tr>
                ) : filteredParents.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-gray-500 py-8">No parents found.</td></tr>
                ) : (
                  filteredParents.map((parent, index) => (
                    <tr key={parent._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-center"><input type="checkbox" /></td>
                      <td className="p-3 font-medium">#{parent.parentId || index + 1}</td>
                      <td className="px-2 py-2 text-center">
                        <img
                          src={
                            parent.photo
                              ? parent.photo.startsWith('http')
                                ? parent.photo
                                : `http://localhost:8000${parent.photo}`
                              : placeholderPhoto
                          }
                          alt="Parent"
                          className="w-8 h-8 rounded-full object-cover mx-auto"
                        />
                      </td>
                      <td className="p-3 capitalize">{parent.name}</td>
                      <td className="p-3">{parent.gender}</td>
                      <td className="p-3">{parent.occupation}</td>
                      <td className="p-3">{parent.address}</td>
                      <td className="p-3">{parent.mobile}</td>
                      <td className="p-3">{parent.email}</td>
                      <td className="p-3 flex items-center gap-3">
                        <button title="View"><FiEye className="text-blue-500 hover:text-blue-700" /></button>
                        <button title="Edit"><FiEdit2 className="text-green-600 hover:text-green-800" /></button>
                        <button title="Delete"><FiTrash2 className="text-red-600 hover:text-red-800" /></button>
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
  );
};

export default AllParents;