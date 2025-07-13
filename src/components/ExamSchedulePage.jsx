import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaSync, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';

const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const sectionOptions = ['A', 'B', 'C'];
const subjectTypes = ['Core', 'Elective'];

const ExamSchedulePage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    examName: '',
    subjectType: '',
    class: '',
    section: '',
    subjectName: '',
    teacher: '',
    day: '',
    time: '',
    date: '',
  });
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [viewExam, setViewExam] = useState(null);
  const [editExam, setEditExam] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editStep, setEditStep] = useState(1);
  const [editSuccess, setEditSuccess] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch all exams from backend
  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/exam-schedule');
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setExams([]);
      console.error('Failed to fetch exams:', err);
    }
    setLoading(false);
  };

  // Add a new exam to backend
  const addExam = async (exam) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/exam-schedule', exam);
      // Automatically fetch fresh data from backend after successful submission
      await fetchExams();
      console.log('Exam added successfully:', res.data);
    } catch (err) {
      console.error('Failed to add exam:', err);
      alert('Failed to add exam. Please try again.');
    }
    setLoading(false);
  };

  // Update an exam
  const updateExam = async (id, updatedData) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/exam-schedule/${id}`, updatedData);
      // Automatically fetch fresh data from backend after successful update
      await fetchExams();
      setEditSuccess(true);
      console.log('Exam updated successfully:', res.data);
    } catch (err) {
      console.error('Failed to update exam:', err);
      alert('Failed to update exam. Please try again.');
    }
    setLoading(false);
  };

  // Delete an exam
  const deleteExam = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/exam-schedule/${id}`);
      // Automatically fetch fresh data from backend after successful deletion
      await fetchExams();
      setDeleteSuccess(true);
      console.log('Exam deleted successfully');
    } catch (err) {
      console.error('Failed to delete exam:', err);
      alert('Failed to delete exam. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = Object.values(form).every((val) => val.trim() !== '');
    if (!isFormValid) return;
    await addExam(form);
    setForm({
      examName: '',
      subjectType: '',
      class: '',
      section: '',
      subjectName: '',
      teacher: '',
      day: '',
      time: '',
      date: '',
    });
  };

  const handleReset = () => {
    setForm({
      examName: '',
      subjectType: '',
      class: '',
      section: '',
      subjectName: '',
      teacher: '',
      day: '',
      time: '',
      date: '',
    });
  };

  // Filtering logic
  const filteredExams = exams.filter((e) => {
    return (
      (!search || e.examName.toLowerCase().includes(search.toLowerCase())) &&
      (!filterClass || e.class === filterClass) &&
      (!filterSubject || e.subjectName.toLowerCase().includes(filterSubject.toLowerCase()))
    );
  });

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Exam Schedule</span>
          </div>

          {/* Success Messages */}
          {editSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Exam schedule updated successfully!
            </div>
          )}
          {deleteSuccess && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Exam schedule deleted successfully!
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Exam Form */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-1/3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Add New Exam</h2>
                <div className="flex gap-2">
                  <button className="text-yellow-500 hover:text-yellow-600 text-lg" title="Expand"><span>&#x25BC;</span></button>
                  <button className="text-green-500 hover:text-green-600 text-lg" title="Refresh"><FaSync size={16} /></button>
                  <button className="text-red-500 hover:text-red-600 text-lg" title="Close"><FaTimes size={16} /></button>
                </div>
              </div>
              <div className="border-b border-gray-200 mb-4"></div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Exam Name</label>
                  <input
                    type="text"
                    name="examName"
                    value={form.examName}
                    onChange={handleChange}
                    className="input-box"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Subject Name</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={form.subjectName}
                    onChange={handleChange}
                    className="input-box"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Teacher</label>
                  <input
                    type="text"
                    name="teacher"
                    value={form.teacher}
                    onChange={handleChange}
                    className="input-box"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Day</label>
                  <select
                    name="day"
                    value={form.day}
                    onChange={handleChange}
                    className="input-box"
                    required
                  >
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Subject Type</label>
                  <select
                    name="subjectType"
                    value={form.subjectType}
                    onChange={handleChange}
                    className="input-box"
                    required
                  >
                    <option value="">Select type</option>
                    {subjectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Class</label>
                  <select
                    name="class"
                    value={form.class}
                    onChange={handleChange}
                    className="input-box"
                    required
                  >
                    <option value="">Select class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Subject Section</label>
                  <select
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    className="input-box"
                    required
                  >
                    <option value="">Select section</option>
                    {sectionOptions.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject Time</label>
                    <input
                      type="text"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="input-box"
                      required
                      placeholder="e.g., 10:00 am - 11:00 am"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="input-box"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="w-full text-white bg-orange-500 hover:bg-orange-600 p-2 rounded">
                    SUBMIT
                  </button>
                  <button type="button" onClick={handleReset} className="w-full text-white bg-gray-500 hover:bg-gray-600 p-2 rounded">
                    RESET
                  </button>
                </div>
              </form>
            </div>

            {/* Table Section */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-2/3 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">All Exams Schedule</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Exam ..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  />
                  <select
                    value={filterClass}
                    onChange={e => setFilterClass(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  >
                    <option value="">All Classes</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Type Subject ..."
                    value={filterSubject}
                    onChange={e => setFilterSubject(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  />
                  <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded shadow text-xs font-semibold flex items-center">SEARCH</button>
                  <button 
                    onClick={fetchExams}
                    className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full w-8 h-8 flex items-center justify-center ml-1" 
                    title="Refresh"
                  >
                    <FaSync size={14} />
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center ml-1" title="Close"><FaTimes size={14} /></button>
                </div>
              </div>
              <div className="border-b border-gray-200 mb-2"></div>

              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 w-8"><input type="checkbox" disabled /></th>
                    <th className="p-2">Exam Name</th>
                    <th className="p-2">Subject Name</th>
                    <th className="p-2">Subject Type</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Section</th>
                    <th className="p-2">Teacher</th>
                    <th className="p-2">Day</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="11" className="text-center p-4">Loading...</td></tr>
                  ) : filteredExams.length === 0 ? (
                    <tr><td colSpan="11" className="text-center p-4 text-gray-400">No schedule found.</td></tr>
                  ) : (
                    filteredExams.map((e, idx) => (
                      <tr key={e._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-2 text-center"><input type="checkbox" /></td>
                        <td className="p-2">{e.examName}</td>
                        <td className="p-2">{e.subjectName}</td>
                        <td className="p-2">{e.subjectType}</td>
                        <td className="p-2">{e.class}</td>
                        <td className="p-2">{e.section}</td>
                        <td className="p-2">{e.teacher}</td>
                        <td className="p-2">{e.day}</td>
                        <td className="p-2">{e.time}</td>
                        <td className="p-2">{e.date}</td>
                        <td className="p-2">
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              className="text-green-600 hover:bg-green-100 p-1 rounded-full"
                              title="View"
                              onClick={() => setViewExam(e)}
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              className="text-blue-600 hover:bg-blue-100 p-1 rounded-full"
                              title="Edit"
                              onClick={() => {
                                setEditExam(e);
                                setEditForm(e);
                                setEditStep(1);
                                setEditSuccess(false);
                              }}
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="text-red-600 hover:bg-red-100 p-1 rounded-full"
                              title="Delete"
                              onClick={() => setExamToDelete(e)}
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* View Modal */}
          {viewExam && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => setViewExam(null)}
                >
                  <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Exam Schedule Details</h2>
                <div className="space-y-2">
                  <div><strong>Exam Name:</strong> {viewExam.examName}</div>
                  <div><strong>Subject Name:</strong> {viewExam.subjectName}</div>
                  <div><strong>Subject Type:</strong> {viewExam.subjectType}</div>
                  <div><strong>Class:</strong> {viewExam.class}</div>
                  <div><strong>Section:</strong> {viewExam.section}</div>
                  <div><strong>Teacher:</strong> {viewExam.teacher}</div>
                  <div><strong>Time:</strong> {viewExam.time}</div>
                  <div><strong>Date:</strong> {viewExam.date}</div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal (multi-step, similar to ClassRoutinePage) */}
          {editExam && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => setEditExam(null)}
                >
                  <FaTimes size={20} />
                </button>
                {editStep === 1 && (
                  <>
                    <h2 className="text-xl font-bold mb-4">Edit Exam Schedule</h2>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        setEditStep(2);
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[{ label: 'Exam Name', name: 'examName', type: 'text' },
                          { label: 'Subject Name', name: 'subjectName', type: 'text' },
                          { label: 'Teacher', name: 'teacher', type: 'text' },
                          { label: 'Day', name: 'day', type: 'text' },
                          { label: 'Time', name: 'time', type: 'text', placeholder: 'e.g., 10:00am - 9:10pm' },
                          { label: 'Date', name: 'date', type: 'date' },
                        ].map(({ label, name, type, placeholder }) => (
                          <div className="mb-4" key={name}>
                            <label className="block text-sm font-medium mb-1">{label}</label>
                            <input
                              type={type}
                              name={name}
                              value={editForm[name] || ''}
                              onChange={e => setEditForm({ ...editForm, [name]: e.target.value })}
                              className="input-box"
                              required
                              {...(placeholder ? { placeholder } : {})}
                            />
                          </div>
                        ))}
                        {/* Selects */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Subject Type</label>
                          <select
                            name="subjectType"
                            value={editForm.subjectType || ''}
                            onChange={e => setEditForm({ ...editForm, subjectType: e.target.value })}
                            className="input-box"
                            required
                          >
                            <option value="">Select type</option>
                            {subjectTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Class</label>
                          <select
                            name="class"
                            value={editForm.class || ''}
                            onChange={e => setEditForm({ ...editForm, class: e.target.value })}
                            className="input-box"
                            required
                          >
                            <option value="">Select class</option>
                            {classOptions.map((cls) => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Section</label>
                          <select
                            name="section"
                            value={editForm.section || ''}
                            onChange={e => setEditForm({ ...editForm, section: e.target.value })}
                            className="input-box"
                            required
                          >
                            <option value="">Select section</option>
                            {sectionOptions.map((sec) => (
                              <option key={sec} value={sec}>{sec}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 p-2 rounded">Review All Details</button>
                        <button type="button" onClick={() => setEditExam(null)} className="w-full text-white bg-gray-400 hover:bg-gray-500 p-2 rounded">Cancel</button>
                      </div>
                    </form>
                  </>
                )}
                {editStep === 2 && (
                  <>
                    <h2 className="text-xl font-bold mb-4">Review All Details</h2>
                    <div className="space-y-2 mb-6">
                      <div><strong>Exam Name:</strong> {editForm.examName}</div>
                      <div><strong>Subject Name:</strong> {editForm.subjectName}</div>
                      <div><strong>Teacher:</strong> {editForm.teacher}</div>
                      <div><strong>Day:</strong> {editForm.day}</div>
                      <div><strong>Time:</strong> {editForm.time}</div>
                      <div><strong>Date:</strong> {editForm.date}</div>
                      <div><strong>Subject Type:</strong> {editForm.subjectType}</div>
                      <div><strong>Class:</strong> {editForm.class}</div>
                      <div><strong>Section:</strong> {editForm.section}</div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setEditStep(3)} className="w-full text-white bg-blue-600 hover:bg-blue-700 p-2 rounded">Confirm Changes</button>
                      <button onClick={() => setEditStep(1)} className="w-full text-white bg-gray-400 hover:bg-gray-500 p-2 rounded">Back</button>
                    </div>
                  </>
                )}
                {editStep === 3 && (
                  <>
                    <h2 className="text-xl font-bold mb-4">Confirm Changes</h2>
                    <div className="mb-6 text-gray-700">Are you sure you want to update this exam schedule?</div>
                    <div className="flex gap-4">
                      <button
                        onClick={async () => {
                          await updateExam(editExam._id, editForm);
                          setEditStep(4);
                        }}
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 p-2 rounded"
                      >
                        Confirm
                      </button>
                      <button onClick={() => setEditStep(2)} className="w-full text-white bg-gray-400 hover:bg-gray-500 p-2 rounded">Back</button>
                    </div>
                  </>
                )}
                {editStep === 4 && editSuccess && (
                  <>
                    <h2 className="text-xl font-bold mb-4 text-green-600">Exam updated successfully!</h2>
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setEditExam(null);
                          setEditForm({});
                          setEditStep(1);
                          setEditSuccess(false);
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        OK
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {examToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => setExamToDelete(null)}
                >
                  <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-red-600">Delete Exam</h2>
                <div className="mb-6 text-gray-700">Are you sure you want to delete this exam schedule?</div>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      await deleteExam(examToDelete._id);
                      setExamToDelete(null);
                      setDeleteSuccess(true);
                    }}
                    className="w-full text-white bg-red-600 hover:bg-red-700 p-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setExamToDelete(null)}
                    className="w-full text-white bg-gray-400 hover:bg-gray-500 p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Success Modal */}
          {deleteSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4 text-green-600">Exam deleted successfully!</h2>
                <div className="flex justify-center">
                  <button
                    onClick={() => setDeleteSuccess(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSchedulePage; 