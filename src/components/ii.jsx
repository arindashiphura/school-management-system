import React, { useState } from 'react';
import { Upload, X, Minimize2, Square } from 'lucide-react';

const StudentAdmissionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    section: '',
    gender: '',
    dateOfBirth: '',
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
    parentsPhoto: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSave = () => {
    console.log('Form data:', formData);
    alert('Form saved successfully!');
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      class: '',
      section: '',
      gender: '',
      dateOfBirth: '',
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
      parentsPhoto: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <span className="text-blue-600">Home</span> &gt; Student Admission Form
          </nav>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Title Bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">Add Student</h1>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Square className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Student Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Student Information</h2>
              
              {/* First Row: First Name, Last Name, Class, Section */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Please Select Class</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Please Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              {/* Second Row: Gender, Date of Birth, Roll No, Admission No */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender*
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Please Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll No.
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission No.
                  </label>
                  <input
                    type="text"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Third Row: Religion, Email, Upload Photo */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="abc@abc.com"
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Student Photo (150px x 150px)
                  </label>
                  <div className="flex h-12">
                    <label className="cursor-pointer flex-shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'studentPhoto')}
                        className="hidden"
                      />
                      <div className="h-full px-4 bg-white border border-gray-300 rounded-l-sm text-sm text-gray-700 flex items-center border-r-0">
                        Choose File
                      </div>
                    </label>
                    <div className="flex-1 px-3 bg-gray-100 border border-gray-300 rounded-r-sm text-sm text-gray-500 flex items-center">
                      No File Chosen
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parents' Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Parents' Information</h2>
              
              {/* First Row: Father's Name, Mother's Name, Father's Occupation, Mother's Occupation */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Occupation
                  </label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Occupation
                  </label>
                  <input
                    type="text"
                    name="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Second Row: Phone Number, Nationality, Present Address, Permanent Address */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Present Address
                  </label>
                  <input
                    type="text"
                    name="presentAddress"
                    value={formData.presentAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permanent Address
                  </label>
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-200 border-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Third Row: Upload Parents' Photos */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Parents' Photos (150px x 150px)
                  </label>
                  <div className="flex h-12">
                    <label className="cursor-pointer flex-shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'parentsPhoto')}
                        className="hidden"
                      />
                      <div className="h-full px-4 bg-white border border-gray-300 rounded-l-sm text-sm text-gray-700 flex items-center border-r-0">
                        Choose File
                      </div>
                    </label>
                    <div className="flex-1 px-3 bg-gray-100 border border-gray-300 rounded-r-sm text-sm text-gray-500 flex items-center">
                      No File Chosen
                    </div>
                  </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                SAVE
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;