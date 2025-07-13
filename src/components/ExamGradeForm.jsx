import React, { useState } from 'react';

const gradeOptions = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
const gradePointOptions = [4.0, 3.8, 3.45, 3.3, 3.0, 2.0, 0];

const ExamGradeForm = ({ onSubmit, initialData = {}, isEditing = false, onCancel }) => {
  initialData = initialData || {};
  const [form, setForm] = useState({
    subject: initialData.subject || '',
    grade: initialData.grade || '',
    gradePoint: initialData.gradePoint || '',
    percentage: initialData.percentage || '',
    comment: initialData.comment || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.grade || !form.gradePoint || !form.percentage) return;
    onSubmit(form);
    if (!isEditing) {
      setForm({ subject: '', grade: '', gradePoint: '', percentage: '', comment: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="input-box"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Grade</label>
        <select
          name="grade"
          value={form.grade}
          onChange={handleChange}
          className="input-box"
          required
        >
          <option value="">Select grade</option>
          {gradeOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Grade Point</label>
        <select
          name="gradePoint"
          value={form.gradePoint}
          onChange={handleChange}
          className="input-box"
          required
        >
          <option value="">Select point</option>
          {gradePointOptions.map((gp) => (
            <option key={gp} value={gp}>{gp}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Percentage</label>
        <input
          type="number"
          name="percentage"
          value={form.percentage}
          onChange={handleChange}
          className="input-box"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Comment</label>
        <input
          type="text"
          name="comment"
          value={form.comment}
          onChange={handleChange}
          className="input-box"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
          {isEditing ? 'Update' : 'Submit'}
        </button>
        {isEditing && (
          <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ExamGradeForm; 