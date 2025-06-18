import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiBell, FiMail } from 'react-icons/fi';

const Header = () => {
  const [noticeCount, setNoticeCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Load unread counts from localStorage
  useEffect(() => {
    const updateCounts = () => {
      // Get all notices and activities from localStorage
      const dashboardData = JSON.parse(localStorage.getItem('dashboardData') || '{}');
      const readNotices = JSON.parse(localStorage.getItem('readNotices') || '[]');
      const readActivities = JSON.parse(localStorage.getItem('readActivities') || '[]');
      
      // Calculate unread counts
      if (dashboardData.notices) {
        const unreadNotices = dashboardData.notices.filter(notice => 
          !readNotices.includes(notice.id)
        ).length;
        setNoticeCount(unreadNotices);
      }
      
      if (dashboardData.activities) {
        const unreadActivities = dashboardData.activities.filter(activity => 
          !readActivities.includes(activity.id)
        ).length;
        setActivityCount(unreadActivities);
      }
    };
    
    // Initial update
    updateCounts();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', updateCounts);
    
    // Custom event for dashboard data updates
    window.addEventListener('dashboardDataUpdated', updateCounts);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('dashboardDataUpdated', updateCounts);
    };
  }, []);

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showMessages) setShowMessages(false);
  };

  // Toggle messages dropdown
  const toggleMessages = () => {
    setShowMessages(!showMessages);
    if (showNotifications) setShowNotifications(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center py-4">
        {/* Left side - Welcome text */}
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="Cedarwood Institute Logo"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-800">
              Welcome to Cedarwood Institute Management System
            </h1>
          </div>
        </div>

        {/* Right side - Navigation elements */}
        <div className="flex items-center space-x-6">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          {/* Language selector */}
          <div className="flex items-center cursor-pointer">
            <span className="text-sm text-gray-700 mr-1">English</span>
            <FiChevronDown className="text-gray-500" />
          </div>

          {/* Notifications */}
          <div className="flex space-x-4">
            <div className="relative">
              <FiBell 
                className="text-gray-600 text-xl cursor-pointer" 
                onClick={toggleNotifications}
              />
              {noticeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">
                  {noticeCount}
                </span>
              )}
              
              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                  <div className="p-3 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <span className="text-xs text-blue-600 cursor-pointer">Mark all as read</span>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <a href="#dashboard" className="block p-3 hover:bg-gray-50">
                      <p className="text-sm">View all notifications in the dashboard</p>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <FiMail 
                className="text-gray-600 text-xl cursor-pointer" 
                onClick={toggleMessages}
              />
              {activityCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">
                  {activityCount}
                </span>
              )}
              
              {/* Messages dropdown */}
              {showMessages && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                  <div className="p-3 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Recent Activities</h3>
                      <span className="text-xs text-blue-600 cursor-pointer">Mark all as read</span>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <a href="#dashboard" className="block p-3 hover:bg-gray-50">
                      <p className="text-sm">View all activities in the dashboard</p>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center">
            <img
              src="/profile.jpg"
              alt="User Profile"
              className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer"
            />
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-800">Arrestab Builds</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
