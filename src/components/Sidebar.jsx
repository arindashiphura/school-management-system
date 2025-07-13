import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaBook,
  FaUserCircle,
  FaGraduationCap,
  FaBookOpen,
  FaCalendarAlt,
  FaUserCheck,
  FaFileAlt,
  FaBus,
  FaBell,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCog
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);


  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/all-students', icon: <FaUserGraduate />, label: 'Students' },
    { path: '/all-teachers', icon: <FaChalkboardTeacher />, label: 'Teachers' },
    { path: '/all-parents', icon: <FaUsers />, label: 'Parents' },
    { path: '/all-books', icon: <FaBook />, label: 'Library' },
    { path: '/account', icon: <FaUserCircle />, label: 'Account' },
    { path: '/all-classes', icon: <FaGraduationCap />, label: 'Class' },
    { path: '/subjects-page', icon: <FaBookOpen />, label: 'Subject' },
    { path: '/class-routine', icon: <FaCalendarAlt />, label: 'Class Routine' },
    { path: '/attendance', icon: <FaUserCheck />, label: 'Attendance' },
    { path: '/exam-schedule', icon: <FaFileAlt />, label: 'Exam' },
    { path: '/transport', icon: <FaBus />, label: 'Transport' },
    { path: '/notice-board', icon: <FaBell />, label: 'Notice' },
    { path: '/message', icon: <FaEnvelope />, label: 'Message' },
    { path: '/map', icon: <FaMapMarkerAlt />, label: 'Map' },
    { path: '/account-settings', icon: <FaCog />, label: 'Account Settings' }
  ];

  return (
    <div className={`h-screen bg-[#002147] text-white fixed top-0 left-0 z-50 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Toggle Button */}
      

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 bg-orange-500 h-16">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        {!isCollapsed && <h1 className="text-lg font-bold">CEDARWOOD INSTITUTE</h1>}
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-4 py-3 hover:bg-[#003171] transition-colors duration-200 ${
              location.pathname === item.path ? 'bg-[#003171] border-l-4 border-orange-500' : 'border-l-4 border-transparent'
            }`}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
