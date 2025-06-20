import React, { useState } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    class: '',
    section: '',
    totalFee: '',
    paymentMethod: '',
    status: '',
    date: '',
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
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.id) newErrors.id = 'ID is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.totalFee) newErrors.totalFee = 'Total fee is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.date) newErrors.date = 'Date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMsg('Payment recorded successfully!');
      setErrorMsg('');
      handleReset();
    } catch (error) {
      setErrorMsg('Error submitting form. Please try again.');
      setSuccessMsg('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      id: '',
      class: '',
      section: '',
      totalFee: '',
      paymentMethod: '',
      status: '',
      date: '',
    });
    setErrors({});
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Create Payment</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full p-8 relative">
              {/* Window Controls */}
              <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', gap: '12px', zIndex: 10 }}>
                <FiMinus style={{ color: 'green', cursor: 'pointer' }} title="Minimize" onClick={handleMinimize} />
                <FiMaximize2 style={{ color: 'orange', cursor: 'pointer' }} title="Maximize" onClick={handleMaximize} />
                <FiX style={{ color: 'red', cursor: 'pointer' }} title="Close" onClick={handleClose} />
              </div>
              <h2 className="text-xl font-bold mb-2">Payment Information</h2>
              <hr className="mb-6 border-gray-200" />
              {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
              {errorMsg && <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>}
              {!isMinimized && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium mb-1">Name</label>
                      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border border-red-500' : ''}`} />
                      {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">ID</label>
                      <input name="id" value={formData.id} onChange={handleChange} placeholder="ID" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.id ? 'border border-red-500' : ''}`} />
                      {errors.id && <div className="text-xs text-red-500 mt-1">{errors.id}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Class</label>
                      <select name="class" value={formData.class} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.class ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select Class</option>
                        <option value="1">Class 1</option>
                        {/* Add more classes as needed */}
                      </select>
                      {errors.class && <div className="text-xs text-red-500 mt-1">{errors.class}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Section</label>
                      <select name="section" value={formData.section} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.section ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select Section</option>
                        <option value="A">A</option>
                        {/* Add more sections as needed */}
                      </select>
                      {errors.section && <div className="text-xs text-red-500 mt-1">{errors.section}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Total Fee</label>
                      <input name="totalFee" value={formData.totalFee} onChange={handleChange} placeholder="Total Fee" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.totalFee ? 'border border-red-500' : ''}`} />
                      {errors.totalFee && <div className="text-xs text-red-500 mt-1">{errors.totalFee}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Payment Method</label>
                      <input name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} placeholder="Payment Method" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.paymentMethod ? 'border border-red-500' : ''}`} />
                      {errors.paymentMethod && <div className="text-xs text-red-500 mt-1">{errors.paymentMethod}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Status</label>
                      <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.status ? 'border border-red-500' : ''}`} />
                      {errors.status && <div className="text-xs text-red-500 mt-1">{errors.status}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Date</label>
                      <input name="date" type="date" value={formData.date} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.date ? 'border border-red-500' : ''}`} />
                      {errors.date && <div className="text-xs text-red-500 mt-1">{errors.date}</div>}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        relative bg-yellow-500 text-white font-bold px-8 py-2 rounded
                        transition-all duration-200 ease-in-out
                        hover:bg-yellow-600 hover:shadow-lg
                        active:bg-yellow-700 active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="opacity-0">SAVE</span>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </>
                      ) : (
                        'SAVE'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className={`
                        bg-blue-700 text-white font-bold px-8 py-2 rounded
                        transition-all duration-200 ease-in-out
                        hover:bg-blue-800 hover:shadow-lg
                        active:bg-blue-900 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      `}
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

export default PaymentForm; 