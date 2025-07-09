import React from 'react';

const ViewStudentModal = ({ open, onClose, student }) => {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Student Details</h3>
        <div className="flex flex-col items-center mb-4">
          <img
            src={
              student.studentPhoto
                ? student.studentPhoto.startsWith('http')
                  ? student.studentPhoto
                  : `http://localhost:8000${student.studentPhoto}`
                : 'https://ui-avatars.com/api/?name=Student&background=random'
            }
            alt="Student"
            className="w-20 h-20 rounded-full object-cover mb-2"
          />
          <div className="font-semibold text-lg">{student.firstName} {student.lastName}</div>
          <div className="text-gray-500">{student.rollNo}</div>
        </div>
        <div className="space-y-2">
          <div><span className="font-semibold">Gender:</span> {student.gender}</div>
          <div><span className="font-semibold">Parent's Name:</span> {student.fatherName || student.parentName || '-'}</div>
          <div><span className="font-semibold">Class:</span> {student.class}</div>
          <div><span className="font-semibold">Section:</span> {student.section}</div>
          <div><span className="font-semibold">Address:</span> {student.presentAddress}</div>
          <div><span className="font-semibold">Date of Birth:</span> {student.dob ? new Date(student.dob).toLocaleDateString('en-GB') : '-'}</div>
          <div><span className="font-semibold">Mobile No.:</span> {student.phoneNumber}</div>
          <div><span className="font-semibold">Email:</span> {student.email}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal; 