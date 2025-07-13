import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaSync, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';

const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const sectionOptions = ['A', 'B', 'C'];
const subjectTypes = ['Core', 'Elective'];

const ClassRoutinePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    subjectName: '',
    subjectType: '',
    class: '',
    section: '',
    subjectCode: '',
    teacher: '',
    time: '',
    day: '',
    date: '',
  });
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [viewRoutine, setViewRoutine] = useState(null);
  const [editRoutine, setEditRoutine] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editStep, setEditStep] = useState(1);
  const [editSuccess, setEditSuccess] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Fetch all routines from backend
  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/class-routine');
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setSubjects([]); // fallback to empty array on error
      console.error('Failed to fetch routines:', err);
    }
    setLoading(false);
  };

  // Add a new routine to backend
  const addRoutine = async (routine) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/class-routine', routine);
      setSubjects(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add routine:', err);
    }
    setLoading(false);
  };

  // Delete a routine from backend
  const deleteRoutine = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/class-routine/${id}`);
      setSubjects(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete routine:', err);
    }
    setLoading(false);
  };

  const updateRoutine = async (id, updatedData) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/class-routine/${id}`, updatedData);
      setSubjects(prev => prev.map(r => (r._id === id ? res.data : r)));
      setEditSuccess(true);
    } catch (err) {
      console.error('Failed to update routine:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = Object.values(form).every((val) => val.trim() !== '');
    if (!isFormValid) return;
    await addRoutine(form);
    setForm({
      subjectName: '',
      subjectType: '',
      class: '',
      section: '',
      subjectCode: '',
      teacher: '',
      time: '',
      day: '',
      date: '',
    });
  };

  const handleReset = () => {
    setForm({
      subjectName: '',
      subjectType: '',
      class: '',
      section: '',
      subjectCode: '',
      teacher: '',
      time: '',
      day: '',
      date: '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      await deleteRoutine(id);
    }
  };

  // Filtering logic
  const filteredSubjects = subjects.filter((s) => {
    return (
      (!search || s.subjectName.toLowerCase().includes(search.toLowerCase())) &&
      (!filterClass || s.class === filterClass) &&
      (!filterSection || s.section === filterSection)
    );
  });

  return (
    <div className=" ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Class Routine</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Subject Form */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-1/3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Create a New Subject</h2>
                <div className="flex gap-2">
                  <button className="text-yellow-500 hover:text-yellow-600 text-lg" title="Expand"><span>&#x25BC;</span></button>
                  <button className="text-green-500 hover:text-green-600 text-lg" title="Refresh"><FaSync size={16} /></button>
                  <button className="text-red-500 hover:text-red-600 text-lg" title="Close"><FaTimes size={16} /></button>
                </div>
              </div>
              <div className="border-b border-gray-200 mb-4"></div>
              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Subject Name', name: 'subjectName', type: 'text' },
                  { label: 'Subject Code', name: 'subjectCode', type: 'text' },
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
                      value={form[name]}
                      onChange={handleChange}
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
                  <label className="block text-sm font-medium mb-1">Class</label>
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
                  <label className="block text-sm font-medium mb-1">Section</label>
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

                {/* Buttons */}
                <div className="flex gap-4">
                  <button type="submit" className="w-full text-white bg-orange-500 hover:bg-orange-600 p-2 rounded">
                    SUBMIT
                  </button>
                  <button type="button" onClick={handleReset} className="w-full text-white bg-blue-900 hover:bg-blue-800 p-2 rounded">
                    RESET
                  </button>
                </div>
              </form>
            </div>

            {/* Table Section */}
            <div className="bg-white p-6 rounded shadow-md w-full md:w-2/3 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">All Classes Schedule</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type Class here..."
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Type Section..."
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="input-box w-36 h-9 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-box w-44 h-9 text-xs"
                  />
                  <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded shadow text-xs font-semibold flex items-center">SEARCH</button>
                  <button className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full w-8 h-8 flex items-center justify-center ml-1" title="Refresh"><FaSync size={14} /></button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center ml-1" title="Close"><FaTimes size={14} /></button>
                </div>
              </div>
              <div className="border-b border-gray-200 mb-2"></div>

              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 w-8"><input type="checkbox" disabled /></th>
                    <th className="p-2">Day</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Section</th>
                    <th className="p-2">Teacher</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9" className="text-center p-4">Loading...</td></tr>
                  ) : filteredSubjects.length === 0 ? (
                    <tr><td colSpan="9" className="text-center p-4 text-gray-400">No schedule found.</td></tr>
                  ) : (
                    filteredSubjects.map((s, idx) => (
                      <tr key={s._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-2 text-center"><input type="checkbox" /></td>
                        <td className="p-2">{s.day}</td>
                        <td className="p-2">{s.class}</td>
                        <td className="p-2">{s.subjectName}</td>
                        <td className="p-2">{s.section}</td>
                        <td className="p-2">{s.teacher}</td>
                        <td className="p-2">{s.time}</td>
                        <td className="p-2">{s.date}</td>
                        <td className="p-2">
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              className="text-green-600 hover:bg-green-100 p-1 rounded-full"
                              title="View"
                              onClick={() => setViewRoutine(s)}
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              className="text-blue-600 hover:bg-blue-100 p-1 rounded-full"
                              title="Edit"
                              onClick={() => {
                                setEditRoutine(s);
                                setEditForm(s);
                                setEditStep(1);
                                setEditSuccess(false);
                              }}
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="text-red-600 hover:bg-red-100 p-1 rounded-full"
                              title="Delete"
                              onClick={() => setRoutineToDelete(s)}
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
        </div>
      </div>
      {viewRoutine && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setViewRoutine(null)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Class Schedule Details</h2>
            <div className="space-y-2">
              <div><strong>Subject Name:</strong> {viewRoutine.subjectName}</div>
              <div><strong>Subject Code:</strong> {viewRoutine.subjectCode}</div>
              <div><strong>Teacher:</strong> {viewRoutine.teacher}</div>
              <div><strong>Day:</strong> {viewRoutine.day}</div>
              <div><strong>Time:</strong> {viewRoutine.time}</div>
              <div><strong>Date:</strong> {viewRoutine.date}</div>
              <div><strong>Subject Type:</strong> {viewRoutine.subjectType}</div>
              <div><strong>Class:</strong> {viewRoutine.class}</div>
              <div><strong>Section:</strong> {viewRoutine.section}</div>
            </div>
          </div>
        </div>
      )}
      {editRoutine && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setEditRoutine(null)}
            >
              <FaTimes size={20} />
            </button>
            {editStep === 1 && (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Class Schedule</h2>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setEditStep(2);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[{ label: 'Subject Name', name: 'subjectName', type: 'text' },
                      { label: 'Subject Code', name: 'subjectCode', type: 'text' },
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
                    <button type="button" onClick={() => setEditRoutine(null)} className="w-full text-white bg-gray-400 hover:bg-gray-500 p-2 rounded">Cancel</button>
                  </div>
                </form>
              </>
            )}
            {editStep === 2 && (
              <>
                <h2 className="text-xl font-bold mb-4">Review All Details</h2>
                <div className="space-y-2 mb-6">
                  <div><strong>Subject Name:</strong> {editForm.subjectName}</div>
                  <div><strong>Subject Code:</strong> {editForm.subjectCode}</div>
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
                <div className="mb-6 text-gray-700">Are you sure you want to update this class schedule?</div>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      await updateRoutine(editRoutine._id, editForm);
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
                <h2 className="text-xl font-bold mb-4 text-green-600">Class updated successfully!</h2>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setEditRoutine(null);
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
      {routineToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setRoutineToDelete(null)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Schedule</h2>
            <div className="mb-6 text-gray-700">Are you sure you want to delete schedule?</div>
            <div className="flex gap-4">
              <button
                onClick={async () => {
                  await deleteRoutine(routineToDelete._id);
                  setRoutineToDelete(null);
                  setDeleteSuccess(true);
                }}
                className="w-full text-white bg-red-600 hover:bg-red-700 p-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setRoutineToDelete(null)}
                className="w-full text-white bg-gray-400 hover:bg-gray-500 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-green-600">Schedule deleted successfully!</h2>
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
  );
};

export default ClassRoutinePage;
