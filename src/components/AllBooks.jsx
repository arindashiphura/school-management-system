import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import EditBookModal from './EditBookModal';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchWriter, setSearchWriter] = useState('');
  const [viewBook, setViewBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/books');
      setBooks(res.data.books || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    (!searchId || book.idNo?.toLowerCase().includes(searchId.toLowerCase())) &&
    (!searchWriter || book.writerName?.toLowerCase().includes(searchWriter.toLowerCase()))
  );

  // Edit book handler
  const handleEditSave = async (form, id) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/books/${id}`, form);
      setEditBook(null);
      setSuccessMsg('Book updated successfully!');
      setShowSuccessModal(true);
      fetchBooks();
    } catch (err) {
      alert('Failed to update book.');
    }
  };
  // Delete book handler
  const handleDelete = async () => {
    if (!deleteBook) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/books/${deleteBook._id}`);
      setDeleteBook(null);
      fetchBooks();
    } catch (err) {
      alert('Failed to delete book.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Books List</span>
          </div>
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg px-8 pt-8 pb-12 mx-auto mt-4">
            <h2 className="text-lg font-semibold mb-4">All Books</h2>
            {/* Search Bar */}
            <div className="flex justify-end items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Type ID here..."
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 180 }}
              />
              <input
                type="text"
                placeholder="Writer Name..."
                value={searchWriter}
                onChange={e => setSearchWriter(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 140 }}
              />
              <button className="bg-blue-600 text-white px-4 py-1 rounded font-semibold flex items-center gap-1">
                <FiSearch /> SEARCH
              </button>
            </div>
            {/* Success message */}
            {successMsg && (
              <div className="mb-4 w-full max-w-2xl mx-auto">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded flex items-center justify-between">
                  <span>{successMsg}</span>
                  <button className="ml-4 text-green-700 font-bold" onClick={() => setSuccessMsg('')}>&times;</button>
                </div>
              </div>
            )}
            {/* Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-2 font-medium text-left"><input type="checkbox" /></th>
                    <th className="px-2 py-2 font-medium text-left">ID No.</th>
                    <th className="px-2 py-2 font-medium text-left">Book Name</th>
                    <th className="px-2 py-2 font-medium text-left">Writer</th>
                    <th className="px-2 py-2 font-medium text-left">Class</th>
                    <th className="px-2 py-2 font-medium text-left">Year</th>
                    <th className="px-2 py-2 font-medium text-left">Creating Date</th>
                    <th className="px-2 py-2 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={8} className="text-center text-red-600 py-8">{error}</td></tr>
                  ) : filteredBooks.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-gray-500">No books found.</td></tr>
                  ) : (
                    filteredBooks.map((book, idx) => (
                      <tr key={book._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 py-2 text-center"><input type="checkbox" /></td>
                        <td className="px-2 py-2"># {book.idNo}</td>
                        <td className="px-2 py-2">{book.bookName}</td>
                        <td className="px-2 py-2">{book.writerName}</td>
                        <td className="px-2 py-2">{book.class}</td>
                        <td className="px-2 py-2">{book.publishingYear}</td>
                        <td className="px-2 py-2">{book.uploadDate ? new Date(book.uploadDate).toLocaleDateString('en-GB') : '-'}</td>
                        <td className="px-2 py-2 flex gap-2 justify-center">
                          <button title="View" onClick={() => setViewBook(book)}><FiEye className="text-blue-600 hover:text-blue-800" /></button>
                          <button title="Edit" onClick={() => setEditBook(book)}><FiEdit2 className="text-green-600 hover:text-green-800" /></button>
                          <button title="Delete" onClick={() => setDeleteBook(book)}><FiTrash2 className="text-red-600 hover:text-red-800" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Modal for viewing book details */}
            {viewBook && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => setViewBook(null)}
                    title="Close"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-2">{viewBook.bookName}</h3>
                    <div className="w-full grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">ID No.:</span> {viewBook.idNo}</div>
                      <div><span className="font-semibold">Writer:</span> {viewBook.writerName}</div>
                      <div><span className="font-semibold">Subject:</span> {viewBook.subject}</div>
                      <div><span className="font-semibold">Class:</span> {viewBook.class}</div>
                      <div><span className="font-semibold">Year:</span> {viewBook.publishingYear}</div>
                      <div><span className="font-semibold">Upload Date:</span> {viewBook.uploadDate ? new Date(viewBook.uploadDate).toLocaleDateString('en-GB') : '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {editBook && (
              <EditBookModal
                open={!!editBook}
                onClose={() => setEditBook(null)}
                book={editBook}
                onSave={handleEditSave}
              />
            )}
            {deleteBook && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => setDeleteBook(null)}
                    title="Close"
                  >
                    &times;
                  </button>
                  <div className="text-center">
                    <h4 className="text-lg font-bold mb-2">Delete Book</h4>
                    <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteBook.bookName}</span>?</p>
                    <div className="flex justify-center gap-3 mt-4">
                      <button
                        className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                        onClick={() => setDeleteBook(null)}
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Success modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-lg shadow-lg px-8 py-8 flex flex-col items-center">
                  <div className="text-green-700 font-bold text-lg mb-6">{successMsg}</div>
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                    onClick={() => { setShowSuccessModal(false); setSuccessMsg(''); }}
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

export default AllBooks; 