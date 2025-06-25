import React, { useState } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';

const StudentPromotionForm = () => {
  const [formData, setFormData] = useState({
    currentSession: '2017-2018',
    promoteToSession: '2017-2018',
    fromClass: '',
    toClass: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);
  const handleClose = () => setIsFormVisible(false);

  if (!isFormVisible) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.currentSession) newErrors.currentSession = 'Current session is required';
    if (!formData.promoteToSession) newErrors.promoteToSession = 'Promote to session is required';
    if (!formData.fromClass) newErrors.fromClass = 'Promotion from class is required';
    if (!formData.toClass) newErrors.toClass = 'Promotion to class is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    // Simulate search action
    setTimeout(() => {
      setIsSubmitting(false);
      // You can add logic to show results here
    }, 1000);
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Student Promotion</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full p-8 relative">
              {/* Window Controls */}
              <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', gap: '12px', zIndex: 10 }}>
                <FiMinus style={{ color: 'green', cursor: 'pointer' }} title="Minimize" onClick={handleMinimize} />
                <FiMaximize2 style={{ color: 'orange', cursor: 'pointer' }} title="Maximize" onClick={handleMaximize} />
                <FiX style={{ color: 'red', cursor: 'pointer' }} title="Close" onClick={handleClose} />
              </div>
              <h2 className="text-xl font-bold mb-2">Search Student Promotion</h2>
              <hr className="mb-6 border-gray-200" />
              {!isMinimized && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium mb-1">Current Session</label>
                      <input name="currentSession" value={formData.currentSession} disabled className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm" />
                      {errors.currentSession && <div className="text-xs text-red-500 mt-1">{errors.currentSession}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Promote to Session</label>
                      <input name="promoteToSession" value={formData.promoteToSession} disabled className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm" />
                      {errors.promoteToSession && <div className="text-xs text-red-500 mt-1">{errors.promoteToSession}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Promotion from Class</label>
                      <select name="fromClass" value={formData.fromClass} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.fromClass ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select</option>
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        {/* Add more classes as needed */}
                      </select>
                      {errors.fromClass && <div className="text-xs text-red-500 mt-1">{errors.fromClass}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Promotion to Class</label>
                      <select name="toClass" value={formData.toClass} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.toClass ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                        {/* Add more classes as needed */}
                      </select>
                      {errors.toClass && <div className="text-xs text-red-500 mt-1">{errors.toClass}</div>}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        bg-yellow-500 text-white font-bold px-8 py-2 rounded
                        transition-all duration-200 ease-in-out
                        hover:bg-yellow-600 hover:shadow-lg
                        active:bg-yellow-700 active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50
                      `}
                    >
                      {isSubmitting ? 'Searching...' : 'Search'}
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

export default StudentPromotionForm; 