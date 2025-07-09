import React from 'react';

const ViewParentModal = ({ open, onClose, parent }) => {
  if (!open || !parent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">Parent Details</h3>
        <div className="flex flex-col items-center mb-4">
          <img
            src={
              parent.photo
                ? parent.photo.startsWith('http')
                  ? parent.photo
                  : `http://localhost:8000${parent.photo}`
                : 'https://ui-avatars.com/api/?name=Parent&background=random'
            }
            alt="Parent"
            className="w-20 h-20 rounded-full object-cover mb-2 border"
          />
          <div className="font-semibold text-lg">{parent.name}</div>
          <div className="text-gray-500">{parent.parentId}</div>
        </div>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold">Gender:</span> {parent.gender}</div>
          <div><span className="font-semibold">Occupation:</span> {parent.occupation}</div>
          <div><span className="font-semibold">Address:</span> {parent.address}</div>
          <div><span className="font-semibold">Mobile No.:</span> {parent.mobile}</div>
          <div><span className="font-semibold">Email:</span> {parent.email}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewParentModal; 