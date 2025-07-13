import React from 'react';
import { FaCheckCircle, FaTimes, FaChevronDown } from 'react-icons/fa';

const SuccessMessage = ({ message = 'Successful Message', onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded p-0 mb-4">
    {/* Header bar */}
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <span className="text-base font-semibold text-green-700">Successful Message</span>
      <div className="flex gap-2">
        <button type="button" className="text-yellow-500 hover:text-yellow-600 text-lg" title="Collapse"><FaChevronDown /></button>
        <button onClick={onClose} className="text-red-500 hover:text-red-600 text-lg" title="Close"><FaTimes /></button>
      </div>
    </div>
    <div className="border-b border-green-200 mb-2"></div>
    <div className="flex items-center gap-3 px-4 pb-4">
      <FaCheckCircle className="text-green-500 text-3xl" />
      <span className="text-green-700 font-semibold text-base">{message}</span>
    </div>
  </div>
);

export default SuccessMessage; 