import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchWriter, setSearchWriter] = useState('');
  const [viewBook, setViewBook] = useState(null);

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
                          <button title="Edit"><FiEdit2 className="text-green-600 hover:text-green-800" /></button>
                          <button title="Delete"><FiTrash2 className="text-red-600 hover:text-red-800" /></button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBooks; 