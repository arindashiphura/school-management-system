// components/StudentAdmissionForm.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const StudentAdmissionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    class: '',
    section: '',
    rollNo: '',
    admissionNo: '',
    religion: '',
    email: '',
    studentPhoto: null,
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    phoneNumber: '',
    nationality: '',
    presentAddress: '',
    permanentAddress: '',
    parentsPhoto: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [studentPhotoPreview, setStudentPhotoPreview] = useState(null);
  const [parentsPhotoPreview, setParentsPhotoPreview] = useState(null);

  const validate = () => {
    const newErrors = {};
    // Student Information
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.rollNo) newErrors.rollNo = 'Roll number is required';
    if (!formData.admissionNo) newErrors.admissionNo = 'Admission number is required';
    if (!formData.religion) newErrors.religion = 'Religion is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.studentPhoto) newErrors.studentPhoto = 'Student photo is required';
    // Parents' Information
    if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
    if (!formData.motherName) newErrors.motherName = "Mother's name is required";
    if (!formData.fatherOccupation) newErrors.fatherOccupation = "Father's occupation is required";
    if (!formData.motherOccupation) newErrors.motherOccupation = "Mother's occupation is required";
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.presentAddress) newErrors.presentAddress = 'Present address is required';
    if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent address is required';
    if (!formData.parentsPhoto) newErrors.parentsPhoto = "Parents' photo is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (name === 'studentPhoto') {
        setStudentPhotoPreview(URL.createObjectURL(files[0]));
      }
      if (name === 'parentsPhoto') {
        setParentsPhotoPreview(URL.createObjectURL(files[0]));
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMsg('Student added successfully!');
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
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      class: '',
      section: '',
      rollNo: '',
      admissionNo: '',
      religion: '',
      email: '',
      studentPhoto: null,
      fatherName: '',
      motherName: '',
      fatherOccupation: '',
      motherOccupation: '',
      phoneNumber: '',
      nationality: '',
      presentAddress: '',
      permanentAddress: '',
      parentsPhoto: null,
    });
    setErrors({});
    setStudentPhotoPreview(null);
    setParentsPhotoPreview(null);
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <Header />

    <div className="min-h-screen bg-gray-100 py-8 px-2">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto p-8">
        <div className="mb-2 text-sm text-gray-500">
          Home &gt; <span className="text-blue-600 cursor-pointer">Student Admission Form</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Add Student</h2>
        <hr className="mb-6 border-gray-200" />
        {successMsg && <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>}
        {errorMsg && <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>}
        <form onSubmit={handleSubmit}>
          {/* Student Information */}
          <h3 className="font-semibold mb-2 text-gray-700">Student Information</h3>
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
              <label className="block text-xs font-medium mb-1">Roll No.*</label>
              <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll No." className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.rollNo ? 'border border-red-500' : ''}`} />
              {errors.rollNo && <div className="text-xs text-red-500 mt-1">{errors.rollNo}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Admission No.*</label>
              <input name="admissionNo" value={formData.admissionNo} onChange={handleChange} placeholder="Admission No." className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.admissionNo ? 'border border-red-500' : ''}`} />
              {errors.admissionNo && <div className="text-xs text-red-500 mt-1">{errors.admissionNo}</div>}
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
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">Upload Student Photo (150px x 150px)*</label>
              <input type="file" name="studentPhoto" accept="image/*" onChange={handleChange} className={`w-full bg-gray-100 rounded px-3 py-2 text-sm ${errors.studentPhoto ? 'border border-red-500' : ''}`} />
              {errors.studentPhoto && <div className="text-xs text-red-500 mt-1">{errors.studentPhoto}</div>}
              {studentPhotoPreview && (
                <img src={studentPhotoPreview} alt="Student Preview" className="mt-2 w-20 h-20 object-cover rounded border" />
              )}
            </div>
          </div>

          <h3 className="font-semibold mb-2 text-gray-700 mt-8">Parents' Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium mb-1">Father's Name*</label>
              <input name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.fatherName ? 'border border-red-500' : ''}`} />
              {errors.fatherName && <div className="text-xs text-red-500 mt-1">{errors.fatherName}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Mother's Name*</label>
              <input name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.motherName ? 'border border-red-500' : ''}`} />
              {errors.motherName && <div className="text-xs text-red-500 mt-1">{errors.motherName}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Father's Occupation*</label>
              <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.fatherOccupation ? 'border border-red-500' : ''}`} />
              {errors.fatherOccupation && <div className="text-xs text-red-500 mt-1">{errors.fatherOccupation}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Mother's Occupation*</label>
              <input name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="Mother's Occupation" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.motherOccupation ? 'border border-red-500' : ''}`} />
              {errors.motherOccupation && <div className="text-xs text-red-500 mt-1">{errors.motherOccupation}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Phone Number*</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.phoneNumber ? 'border border-red-500' : ''}`} />
              {errors.phoneNumber && <div className="text-xs text-red-500 mt-1">{errors.phoneNumber}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Nationality*</label>
              <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.nationality ? 'border border-red-500' : ''}`} />
              {errors.nationality && <div className="text-xs text-red-500 mt-1">{errors.nationality}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Present Address*</label>
              <input name="presentAddress" value={formData.presentAddress} onChange={handleChange} placeholder="Present Address" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.presentAddress ? 'border border-red-500' : ''}`} />
              {errors.presentAddress && <div className="text-xs text-red-500 mt-1">{errors.presentAddress}</div>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Permanent Address*</label>
              <input name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Permanent Address" className={`w-full bg-gray-100 border-none rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${errors.permanentAddress ? 'border border-red-500' : ''}`} />
              {errors.permanentAddress && <div className="text-xs text-red-500 mt-1">{errors.permanentAddress}</div>}
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-medium mb-1">Upload Parents' Photos (150px x 150px)*</label>
              <input type="file" name="parentsPhoto" onChange={handleChange} className={`w-full bg-gray-100 rounded px-3 py-2 text-sm ${errors.parentsPhoto ? 'border border-red-500' : ''}`} />
              {errors.parentsPhoto && <div className="text-xs text-red-500 mt-1">{errors.parentsPhoto}</div>}
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
      </div>
      </div>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;
