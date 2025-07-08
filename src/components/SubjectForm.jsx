import React, { useState } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import axios from 'axios';

const SubjectForm = ({ onSubjectAdded, successMsg }) => {
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectType: '',
    class: '',
    subjectCode: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      subjectName: '',
      subjectType: '',
      class: '',
      subjectCode: '',
    });
    setErrorMsg('');
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);
  const handleClose = () => setIsFormVisible(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.post('http://localhost:8000/api/v1/subjects', {
        subjectName: formData.subjectName,
        subjectType: formData.subjectType,
        class: formData.class,
        subjectCode: formData.subjectCode,
      });
      handleReset();
      if (onSubjectAdded) onSubjectAdded();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Error submitting form. Please try again.'
      );
    }
  };

  if (!isFormVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
      {/* Window Controls */}
      <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', gap: '12px', zIndex: 10 }}>
        <FiMinus style={{ color: 'green', cursor: 'pointer' }} title="Minimize" onClick={handleMinimize} />
        <FiMaximize2 style={{ color: 'orange', cursor: 'pointer' }} title="Maximize" onClick={handleMaximize} />
        <FiX style={{ color: 'red', cursor: 'pointer' }} title="Close" onClick={handleClose} />
      </div>
      <h2 className="text-xl font-bold mb-2">Create a New Subject</h2>
      <hr className="mb-6 border-gray-200" />
      {!isMinimized && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium mb-1">Subject Name</label>
              <input name="subjectName" value={formData.subjectName} onChange={handleChange} placeholder="Subject Name" className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Subject Type</label>
              <select name="subjectType" value={formData.subjectType} onChange={handleChange} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                <option value="">Select Type</option>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Select Class</label>
              <select name="class" value={formData.class} onChange={handleChange} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                <option value="">Select Class</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Subject Code</label>
              <input name="subjectCode" value={formData.subjectCode} onChange={handleChange} placeholder="Subject Code" className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
          {errorMsg && <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="relative bg-yellow-500 text-white font-bold px-8 py-2 rounded transition-all duration-200 ease-in-out hover:bg-yellow-600 hover:shadow-lg active:bg-yellow-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              SUBMIT
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
  );
};

export default SubjectForm; 