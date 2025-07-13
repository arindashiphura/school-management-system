import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ExamGradesTable = ({ grades, onEdit, onDelete }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left"><input type="checkbox" disabled /></th>
              <th className="p-2 text-left">Subject Name</th>
              <th className="p-2 text-left">Grades</th>
              <th className="p-2 text-left">Grade Points</th>
              <th className="p-2 text-left">Percentages</th>
              <th className="p-2 text-left">Comments</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-4 text-gray-400">No grades found.</td></tr>
            ) : (
              grades.map((g, idx) => (
                <tr key={g._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2"><input type="checkbox" /></td>
                  <td className="p-2">{g.subject}</td>
                  <td className="p-2">{g.grade}</td>
                  <td className="p-2">{g.gradePoint}</td>
                  <td className="p-2">{g.percentage}</td>
                  <td className="p-2">{g.comment}</td>
                  <td className="p-2">{g.date ? new Date(g.date).toLocaleDateString() : ''}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => onEdit(g)} className="text-green-600 hover:text-green-800"><FaEdit /></button>
                    <button onClick={() => onDelete(g._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamGradesTable; 