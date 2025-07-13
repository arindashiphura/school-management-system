import React from 'react';
import { FaTimesCircle, FaTimes, FaChevronDown } from 'react-icons/fa';

const ErrorMessage = ({ message = 'Error Message', onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded p-0 mb-4">
    {/* Header bar */}
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <span className="text-base font-semibold text-red-700">Error Message</span>
      <div className="flex gap-2">
        <button type="button" className="text-yellow-500 hover:text-yellow-600 text-lg" title="Collapse"><FaChevronDown /></button>
        <button onClick={onClose} className="text-red-500 hover:text-red-600 text-lg" title="Close"><FaTimes /></button>
      </div>
    </div>
    <div className="border-b border-red-200 mb-2"></div>
    <div className="flex items-center gap-3 px-4 pb-4">
      <FaTimesCircle className="text-red-500 text-3xl" />
      <span className="text-red-700 font-semibold text-base">{message}</span>
    </div>
  </div>
);

export default ErrorMessage; 