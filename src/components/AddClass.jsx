import React, { useState } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';

const AddClass = () => {
  const [formData, setFormData] = useState({
    teachersName: '',
    id: '',
    class: '',
    section: '',
    subject: '',
    time: '',
    date: '',
    gender: '',
    photo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);
  const handleClose = () => setIsFormVisible(false);

  if (!isFormVisible) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.teachersName) newErrors.teachersName = "Teacher's name is required";
    if (!formData.id) newErrors.id = 'ID is required';
    // Add more validation as needed
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8000/api/v1/classes', {
        classId: formData.id,
        teacherName: formData.teachersName,
        gender: formData.gender || '',
        subject: formData.subject,
        class: formData.class,
        section: formData.section,
        date: formData.date,
        timings: formData.time,
        photo: formData.photo || '',
      });
      setIsSubmitting(false);
      setSuccessMsg('Class added successfully!');
      setFormData({
        teachersName: '',
        id: '',
        class: '',
        section: '',
        subject: '',
        time: '',
        date: '',
        gender: '',
        photo: '',
      });
    } catch (error) {
      setIsSubmitting(false);
      setErrorMsg('Failed to add class.');
    }
  };

  const handleReset = () => {
    setFormData({
      teachersName: '',
      id: '',
      class: '',
      section: '',
      subject: '',
      time: '',
      date: '',
      gender: '',
      photo: '',
    });
    setErrors({});
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg relative px-8 pt-8 pb-12 mx-auto">
            {/* Breadcrumb and window controls */}
            
            <div className="flex justify-between items-center mb-2">
            <div className="mb-2 text-sm text-gray-500">
              Home &gt; <span className="text-blue-600 cursor-pointer">Add New Class</span>
            </div>
              <div className="flex gap-2">
                <button title="Minimize" onClick={handleMinimize} className="text-gray-400 hover:text-gray-600"><FiMinus size={16} /></button>
                <button title="Maximize" onClick={handleMaximize} className="text-gray-400 hover:text-gray-600"><FiMaximize2 size={16} /></button>
                <button title="Close" onClick={handleClose} className="text-gray-400 hover:text-gray-600"><FiX size={16} /></button>
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2 mt-6">Class Information</h2>
            <div className="border-b border-gray-200 mb-8" />
            {!isMinimized && (
              <form className="space-y-8" onSubmit={handleSubmit} onReset={handleReset}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Teacher's Name</label>
                    <input
                      type="text"
                      name="teachersName"
                      value={formData.teachersName}
                      onChange={handleChange}
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    />
                    {errors.teachersName && <div className="text-xs text-red-500">{errors.teachersName}</div>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    />
                    {errors.id && <div className="text-xs text-red-500">{errors.id}</div>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Class</label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    >
                      <option value="">Please Select Class</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    >
                      <option value="">Please Select Section</option>
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    >
                      <option value="">Select Subject</option>
                      <option value="Math">Math</option>
                      <option value="English">English</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Time</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    >
                      <option value="">Select Time</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Date</label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      placeholder="dd/mm/yyyy"
                      className="bg-gray-100 px-3 py-2 rounded w-full text-sm focus:outline-none"
                    />
                  </div>
                  <div></div>
                </div>
                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow-md text-base tracking-wide"
                  >
                    {isSubmitting ? 'Saving...' : 'SAVE'}
                  </button>
                  <button
                    type="reset"
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded shadow-md text-base tracking-wide"
                  >
                    RESET
                  </button>
                </div>
                {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
                {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClass;
