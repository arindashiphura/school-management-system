import React from 'react';

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-4 text-blue-600 font-semibold text-lg">{text}</span>
  </div>
);

export default LoadingSpinner; 