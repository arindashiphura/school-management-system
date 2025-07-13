import React, { useState } from 'react';
import MessageForm from './MessageForm';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';
import Sidebar from './Sidebar';
import Header from './Header';

const MessagePage = () => {
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(true);

  // Dummy submit handler
  const handleSubmit = (form) => {
    // You can add real logic here
    setShowSuccess(true);
    setShowError(false);
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Message</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Message Form */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-2/3">
              <MessageForm onSubmit={handleSubmit} />
            </div>
            {/* Right: Success/Error Messages */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {showSuccess && (
                <SuccessMessage onClose={() => setShowSuccess(false)} />
              )}
              {showError && (
                <ErrorMessage onClose={() => setShowError(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage; 