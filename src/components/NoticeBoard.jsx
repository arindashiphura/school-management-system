import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import { FiUser, FiCalendar, FiSearch, FiX, FiMinus, FiMaximize2 } from 'react-icons/fi';

const nameColors = [
  'text-purple-600',
  'text-orange-500',
  'text-green-600',
  'text-blue-600',
];

// Improved human-readable time ago function
function timeAgo(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return diffHr === 1 ? '1 hr ago' : `${diffHr} hr ago`;
  if (diffDay === 1) return 'yesterday';
  return `${diffDay} days ago`;
}

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', details: '', postedBy: '', date: '' });
  const [formError, setFormError] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/notices');
      setNotices(res.data.notices || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch notices.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title || !form.details || !form.postedBy || !form.date) {
      setFormError('All fields are required.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/v1/notices', form);
      setForm({ title: '', details: '', postedBy: '', date: '' });
      fetchNotices();
    } catch (err) {
      setFormError('Failed to submit notice.');
    }
  };

  const filteredNotices = searchDate
    ? notices.filter(n => n.date && n.date.startsWith(searchDate))
    : notices;

  if (isClosed) return null;

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="mb-2 text-sm text-gray-500"></div>
          <div className="flex h-screen bg-gray-100 px-8 py-8 gap-8">
            {/* Left: Create Notice Form */}
            <div className="w-1/3 bg-white rounded-lg shadow-lg flex flex-col px-8 py-8 relative min-w-[340px] max-w-[400px]">
              
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500">
                  Home <span className="mx-1">-</span> <span className="text-blue-600 cursor-pointer">Notice Board</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block border border-gray-300" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block border border-gray-300" />
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block border border-gray-300" />
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-6">Create a Notice</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 justify-between">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      className="bg-gray-100 px-3 py-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
                      placeholder="Enter title"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Details</label>
                  <div className="relative">
                    <textarea
                      name="details"
                      value={form.details}
                      onChange={handleInputChange}
                      className="bg-gray-100 px-3 py-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
                      placeholder="Enter details"
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Posted by</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="postedBy"
                      value={form.postedBy}
                      onChange={handleInputChange}
                      className="bg-gray-100 px-3 py-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
                      placeholder="Enter name"
                    />
                    <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      className="bg-gray-100 px-3 py-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                {formError && <div className="text-red-600 text-xs mb-2">{formError}</div>}
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow-md mt-2 text-base tracking-wide self-start"
                >
                  SUBMIT
                </button>
              </form>
            </div>

            {/* Right: Notice Board */}
            <div className="flex-1 bg-white rounded-lg shadow-lg px-8 py-8 relative flex flex-col min-w-[500px]">
              {/* Header: Title, Search, Window controls */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Notice Board</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={e => setSearchDate(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Search by date"
                    style={{ minWidth: 140 }}
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-1 text-sm shadow-md"> <FiSearch />SEARCH</button>
                  <button title="Minimize" className="text-gray-400 hover:text-gray-600"><FiMinus size={16} /></button>
                  <button title="Maximize" className="text-gray-400 hover:text-gray-600"><FiMaximize2 size={16} /></button>
                  <button title="Close" className="text-gray-400 hover:text-gray-600"><FiX size={16} /></button>
                </div>
              </div>
              {/* Notice List */}
              <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : error ? (
                  <div className="text-center text-red-600 py-8">{error}</div>
                ) : filteredNotices.length === 0 ? (
                  <div className="text-center text-gray-500">No notices found.</div>
                ) : (
                  filteredNotices.map((notice, idx) => (
                    <div key={notice._id || idx} className="mb-6">
                      <div className="text-xs text-gray-400 font-semibold mb-1">
                        {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-sm ${nameColors[idx % nameColors.length]}`}>{notice.postedBy}</span>
                        <span className="text-xs text-gray-400">{timeAgo(notice.createdAt)}</span>
                      </div>
                      <div className="text-gray-700 text-sm mb-1">{notice.details}</div>
                      <div className="border-b border-gray-200 mt-3" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard; 