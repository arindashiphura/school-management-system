import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ExamGradeForm from './ExamGradeForm';
import ExamGradesTable from './ExamGradesTable';
import axios from 'axios';
import { FaSync, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:8000/api/v1/exam-grades';

const ExamGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchPoints, setSearchPoints] = useState('');
  const [editGrade, setEditGrade] = useState(null);

  // Fetch all grades
  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setGrades(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setGrades([]);
      console.error('Failed to fetch grades:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Add new grade
  const handleAdd = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(API_URL, data);
      setGrades(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Failed to add grade:', err);
    }
    setLoading(false);
  };

  // Edit grade
  const handleEdit = (grade) => {
    setEditGrade(grade);
  };

  // Update grade
  const handleUpdate = async (data) => {
    if (!editGrade) return;
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/${editGrade._id}`, data);
      setGrades(prev => prev.map(g => (g._id === editGrade._id ? res.data : g)));
      setEditGrade(null);
    } catch (err) {
      console.error('Failed to update grade:', err);
    }
    setLoading(false);
  };

  // Delete grade
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setGrades(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error('Failed to delete grade:', err);
    }
    setLoading(false);
  };

  // Filtered grades
  const filteredGrades = grades.filter(g => {
    const matchGrade = !search || (g.grade && g.grade.toLowerCase().includes(search.toLowerCase()));
    const matchPoints = !searchPoints || (g.gradePoint && g.gradePoint.toString().includes(searchPoints));
    return matchGrade && matchPoints;
  });

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Exam Grades</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Add/Edit Grade Form */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-1/3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{editGrade ? 'Edit Grade' : 'Add New Grade'}</h2>
                {editGrade && (
                  <button onClick={() => setEditGrade(null)} className="text-red-500 hover:text-red-600 text-lg" title="Cancel Edit">&times;</button>
                )}
              </div>
              <div className="border-b border-gray-200 mb-4"></div>
              <ExamGradeForm
                onSubmit={editGrade ? handleUpdate : handleAdd}
                initialData={editGrade}
                isEditing={!!editGrade}
                onCancel={() => setEditGrade(null)}
              />
            </div>
            {/* Right: Grades Table */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-2/3">
              {/* Header row with heading and search/filter bar */}
              <div className="flex items-center gap-2 justify-between mb-4">
                <h2 className="text-lg font-semibold">Exam Grades List</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Grade ..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Search Points ..."
                    value={searchPoints}
                    onChange={e => setSearchPoints(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  />
                  <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded shadow text-xs font-semibold flex items-center">SEARCH</button>
                  <button
                    onClick={fetchGrades}
                    className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full w-8 h-8 flex items-center justify-center"
                    title="Refresh"
                  >
                    <FaSync size={14} />
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center"
                    title="Close"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
              <div className="border-b border-gray-200 mb-2"></div>
              <ExamGradesTable
                grades={filteredGrades}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {loading && <div className="text-center text-gray-400 mt-4">Loading...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamGradesPage; 