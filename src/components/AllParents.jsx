import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';
import ViewParentModal from './ViewParentModal';
import EditParentModal from './EditParentModal';

const placeholderPhoto = 'https://ui-avatars.com/api/?name=Parent&background=random';

const AllParents = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewParent, setViewParent] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editParent, setEditParent] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteParent, setDeleteParent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
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

  const handleEditSave = async (formData, parentId) => {
    setEditLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/v1/parents/${parentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditSuccess(true);
      await fetchParents();
    } catch (err) {
      alert('Failed to update parent.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteParent) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/parents/${deleteParent._id}`);
      setDeleteSuccess(true);
      await fetchParents();
    } catch (err) {
      alert('Failed to delete parent.');
    } finally {
      setDeleteLoading(false);
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
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Parents List</span>
          </div>
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg px-8 pt-8 pb-12 mx-auto mt-4">
            <h2 className="text-lg font-semibold mb-4">All Parents</h2>
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
                placeholder="Type mobile..."
                value={searchMobile}
                onChange={e => setSearchMobile(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 140 }}
              />
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 font-medium text-left"><input type="checkbox" /></th>
                    <th className="p-3 font-medium text-left">Parent ID</th>
                    <th className="p-3 font-medium text-left">Photo</th>
                    <th className="p-3 font-medium text-left">Name</th>
                    <th className="p-3 font-medium text-left">Gender</th>
                    <th className="p-3 font-medium text-left">Occupation</th>
                    <th className="p-3 font-medium text-left">Address</th>
                    <th className="p-3 font-medium text-left">Mobile No.</th>
                    <th className="p-3 font-medium text-left">Email</th>
                    <th className="p-3 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={10} className="text-center py-8">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={10} className="text-center text-red-600 py-8">{error}</td></tr>
                  ) : filteredParents.length === 0 ? (
                    <tr><td colSpan={10} className="text-center text-gray-500">No parents found.</td></tr>
                  ) : (
                    filteredParents.map((parent, idx) => (
                      <tr key={parent._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 text-center"><input type="checkbox" /></td>
                        <td className="p-3">{parent.parentId}</td>
                        <td className="p-3 text-center">
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
                          <button
                            title="View"
                            onClick={() => {
                              setViewParent(parent);
                              setViewModalOpen(true);
                            }}
                          >
                            <FiEye className="text-blue-600 hover:text-blue-800" />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => {
                              setEditParent(parent);
                              setEditModalOpen(true);
                            }}
                          >
                            <FiEdit2 className="text-green-600 hover:text-green-800" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => {
                              setDeleteParent(parent);
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
            {/* View Modal */}
            <ViewParentModal
              open={viewModalOpen}
              onClose={() => setViewModalOpen(false)}
              parent={viewParent}
            />
            {/* Edit Modal */}
            <EditParentModal
              open={editModalOpen}
              onClose={() => {
                setEditModalOpen(false);
                setEditParent(null);
              }}
              parent={editParent}
              onSave={handleEditSave}
            />
            {/* Edit Success Modal */}
            {editSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                  <h4 className="text-lg font-bold mb-4 text-green-700">Parent updated successfully!</h4>
                  <button
                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-2"
                    onClick={() => {
                      setEditSuccess(false);
                      setEditModalOpen(false);
                      setEditParent(null);
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
                  <h4 className="text-lg font-bold mb-4 text-red-700">Are you sure you want to delete this parent?</h4>
                  <div className="mb-4 text-gray-700">{deleteParent && `${deleteParent.name} (${deleteParent.parentId})`}</div>
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
                  <h4 className="text-lg font-bold mb-4 text-green-700">Parent deleted successfully!</h4>
                  <button
                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-2"
                    onClick={() => {
                      setDeleteSuccess(false);
                      setDeleteModalOpen(false);
                      setDeleteParent(null);
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

export default AllParents;