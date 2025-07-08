import React, { useState } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';

const TeacherForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    section: '',
    gender: '',
    dob: '',
    idNo: '',
    subject: '',
    religion: '',
    email: '',
    phoneNo: '',
    address: '',
    teacherPhoto: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [teacherPhotoPreview, setTeacherPhotoPreview] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);
  const handleClose = () => setIsFormVisible(false);

  if (!isFormVisible) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.idNo) newErrors.idNo = 'ID number is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.religion) newErrors.religion = 'Religion is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.phoneNo) newErrors.phoneNo = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.teacherPhoto) newErrors.teacherPhoto = 'Teacher photo is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (name === 'teacherPhoto') {
        setTeacherPhotoPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      // Build FormData for file upload
      const form = new FormData();
      form.append('teacherId', formData.idNo);
      form.append('name', `${formData.firstName} ${formData.lastName}`);
      form.append('gender', formData.gender);
      form.append('subject', formData.subject);
      form.append('class', formData.class);
      form.append('section', formData.section);
      form.append('address', formData.address);
      form.append('dob', formData.dob);
      form.append('mobile', formData.phoneNo);
      form.append('email', formData.email);
      if (formData.teacherPhoto) {
        form.append('photo', formData.teacherPhoto);
      }
      // Post to backend
      const res = await axios.post('http://localhost:8000/api/v1/teachers', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMsg('Teacher added successfully!');
      setErrorMsg('');
      handleReset();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Error submitting form. Please try again.'
      );
      setSuccessMsg('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      class: '',
      section: '',
      gender: '',
      dob: '',
      idNo: '',
      subject: '',
      religion: '',
      email: '',
      phoneNo: '',
      address: '',
      teacherPhoto: null,
    });
    setErrors({});
    setTeacherPhotoPreview(null);
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Add New Teacher</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full p-8 relative">
              {/* Window Controls */}
              <div style={{ position: 'absolute', top: 16, right: 24, display: 'flex', gap: '12px', zIndex: 10 }}>
                <FiMinus style={{ color: 'green', cursor: 'pointer' }} title="Minimize" onClick={handleMinimize} />
                <FiMaximize2 style={{ color: 'orange', cursor: 'pointer' }} title="Maximize" onClick={handleMaximize} />
                <FiX style={{ color: 'red', cursor: 'pointer' }} title="Close" onClick={handleClose} />
              </div>
              <h2 className="text-xl font-bold mb-2">Teacher Information</h2>
              <hr className="mb-6 border-gray-200" />
              {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
              {errorMsg && <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>}
              {!isMinimized && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium mb-1">First Name*</label>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name*" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.firstName ? 'border border-red-500' : ''}`} />
                      {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Last Name*</label>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name*" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.lastName ? 'border border-red-500' : ''}`} />
                      {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Class*</label>
                      <select name="class" value={formData.class} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.class ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select Class</option>
                        <option value="1">Class 1</option>
                        {/* Add more classes as needed */}
                      </select>
                      {errors.class && <div className="text-xs text-red-500 mt-1">{errors.class}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Section*</label>
                      <select name="section" value={formData.section} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.section ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select Section</option>
                        <option value="A">A</option>
                        {/* Add more sections as needed */}
                      </select>
                      {errors.section && <div className="text-xs text-red-500 mt-1">{errors.section}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Gender*</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.gender ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <div className="text-xs text-red-500 mt-1">{errors.gender}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Date of Birth*</label>
                      <input name="dob" type="date" value={formData.dob} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.dob ? 'border border-red-500' : ''}`} />
                      {errors.dob && <div className="text-xs text-red-500 mt-1">{errors.dob}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">ID No.*</label>
                      <input name="idNo" value={formData.idNo} onChange={handleChange} placeholder="ID No." className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.idNo ? 'border border-red-500' : ''}`} />
                      {errors.idNo && <div className="text-xs text-red-500 mt-1">{errors.idNo}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Subject*</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm ${errors.subject ? 'border border-red-500' : ''}`}>
                        <option value="">Please Select Subject</option>
                        <option value="Math">Math</option>
                        <option value="English">English</option>
                        {/* Add more subjects as needed */}
                      </select>
                      {errors.subject && <div className="text-xs text-red-500 mt-1">{errors.subject}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Religion*</label>
                      <input name="religion" value={formData.religion} onChange={handleChange} placeholder="Religion" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.religion ? 'border border-red-500' : ''}`} />
                      {errors.religion && <div className="text-xs text-red-500 mt-1">{errors.religion}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Email*</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="abc@xyz.com" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border border-red-500' : ''}`} />
                      {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Phone No.*</label>
                      <input name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone No." className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.phoneNo ? 'border border-red-500' : ''}`} />
                      {errors.phoneNo && <div className="text-xs text-red-500 mt-1">{errors.phoneNo}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Address*</label>
                      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.address ? 'border border-red-500' : ''}`} />
                      {errors.address && <div className="text-xs text-red-500 mt-1">{errors.address}</div>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1">Upload Teacher Photo (150px x 150px)*</label>
                      <input type="file" name="teacherPhoto" accept="image/*" onChange={handleChange} className={`w-full bg-gray-100 rounded px-3 py-2 text-sm ${errors.teacherPhoto ? 'border border-red-500' : ''}`} />
                      {errors.teacherPhoto && <div className="text-xs text-red-500 mt-1">{errors.teacherPhoto}</div>}
                      {teacherPhotoPreview && (
                        <img src={teacherPhotoPreview} alt="Teacher Preview" className="mt-2 w-20 h-20 object-cover rounded border" />
                      )}
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

export default TeacherForm; 