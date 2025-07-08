import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import axios from 'axios';

const BookForm = () => {
  const [formData, setFormData] = useState({
    bookName: '',
    subject: '',
    writerName: '',
    class: '',
    publishingYear: '',
    uploadDate: '',
    idNo: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      bookName: '',
      subject: '',
      writerName: '',
      class: '',
      publishingYear: '',
      uploadDate: '',
      idNo: '',
    });
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);
  const handleClose = () => setIsFormVisible(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await axios.post('http://localhost:8000/api/v1/books', {
        bookName: formData.bookName,
        subject: formData.subject,
        writerName: formData.writerName,
        class: formData.class,
        publishingYear: formData.publishingYear,
        uploadDate: formData.uploadDate,
        idNo: formData.idNo,
      });
      setSuccessMsg('Book added successfully!');
      handleReset();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Error submitting form. Please try again.'
      );
    }
  };

  if (!isFormVisible) return null;

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Add New Book</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full p-8 relative">
              {/* Window Controls */}
              <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', gap: '12px', zIndex: 10 }}>
                <FiMinus style={{ color: 'green', cursor: 'pointer' }} title="Minimize" onClick={handleMinimize} />
                <FiMaximize2 style={{ color: 'orange', cursor: 'pointer' }} title="Maximize" onClick={handleMaximize} />
                <FiX style={{ color: 'red', cursor: 'pointer' }} title="Close" onClick={handleClose} />
              </div>
              <h2 className="text-xl font-bold mb-2">Book Information</h2>
              <hr className="mb-6 border-gray-200" />
              {!isMinimized && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium mb-1">Book Name</label>
                      <input name="bookName" value={formData.bookName} onChange={handleChange} placeholder="Book Name" className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Subject</label>
                      <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Writer's Name</label>
                      <input name="writerName" value={formData.writerName} onChange={handleChange} placeholder="Writer's Name" className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Class</label>
                      <select name="class" value={formData.class} onChange={handleChange} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                        <option value="">Please Select Class</option>
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                        {/* Add more classes as needed */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Publishing Year</label>
                      <input name="publishingYear" value={formData.publishingYear} onChange={handleChange} placeholder="Publishing Year" className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Upload Date</label>
                      <input name="uploadDate" type="date" value={formData.uploadDate} onChange={handleChange} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">ID No.</label>
                      <input name="idNo" value={formData.idNo} onChange={handleChange} placeholder="ID No." className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </div>
                  {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
                  {errorMsg && <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>}
                  <div className="flex gap-4 mt-8">
                    <button
                      type="submit"
                      className="relative bg-yellow-500 text-white font-bold px-8 py-2 rounded transition-all duration-200 ease-in-out hover:bg-yellow-600 hover:shadow-lg active:bg-yellow-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    >
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="bg-blue-700 text-white font-bold px-8 py-2 rounded transition-all duration-200 ease-in-out hover:bg-blue-800 hover:shadow-lg active:bg-blue-900 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      RESET
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm; 