import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiMinus, FiMaximize2, FiX, FiSearch, FiEye } from 'react-icons/fi';

const placeholderPhoto = 'https://ui-avatars.com/api/?name=Teacher&background=random';

const fieldLabels = {
  teacherName: 'Teacher Name',
  gender: 'Gender',
  classId: 'ID',
  subject: 'Subject',
  class: 'Class',
  section: 'Section',
  date: 'Date',
  timings: 'Timings',
};

function formatTimeString(timeStr) {
  // Accepts '02:30am - 10:00 am' or similar, returns '02:30 am - 10:00 am'
  if (!timeStr) return '';
  const parts = timeStr.split('-').map(s => s.trim());
  const format = t => {
    // Extract hh:mm and am/pm
    const match = t.match(/(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?/);
    if (!match) return t;
    let [_, h, m, ap] = match;
    h = h.padStart(2, '0');
    ap = ap ? ap.toLowerCase() : '';
    return `${h}:${m} ${ap}`.trim();
  };
  if (parts.length === 2) {
    return `${format(parts[0])} - ${format(parts[1])}`;
  }
  return format(parts[0]);
}

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [viewClass, setViewClass] = useState(null);
  const [editClass, setEditClass] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editStep, setEditStep] = useState(1);
  const [changedFields, setChangedFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteClass, setDeleteClass] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/classes');
      setClasses(res.data.classes || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch classes.');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Search functionality can be implemented here if needed
    // Currently filtering happens in real-time via filteredClasses
  };

  // Edit logic
  const handleEdit = (classObj) => {
    setEditClass(classObj);
    setEditForm({
      teacherName: classObj.teacherName || '',
      gender: classObj.gender || '',
      classId: classObj.classId || '',
      subject: classObj.subject || '',
      class: classObj.class || '',
      section: classObj.section || '',
      date: classObj.date || '',
      timings: classObj.timings || '',
    });
    setEditStep(1);
    setChangedFields([]);
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const getChangedFields = () => {
    if (!editClass) return [];
    const changes = [];
    Object.keys(editForm).forEach((key) => {
      if (editForm[key] !== (editClass[key] || '')) {
        changes.push({
          key,
          oldValue: editClass[key] || '',
          newValue: editForm[key],
        });
      }
    });
    return changes;
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const changes = getChangedFields();
    setChangedFields(changes);
    setEditStep(2);
  };
  const handleEditConfirm = () => {
    setEditStep(3);
  };
  const handleEditSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:8000/api/v1/classes/${editClass._id}`, editForm);
      setEditClass(null);
      setEditStep(1);
      setChangedFields([]);
      fetchClasses();
    } catch (err) {
      alert('Failed to update class.');
    } finally {
      setSaving(false);
    }
  };

  // Delete logic
  const handleDelete = (classObj) => {
    setDeleteClass(classObj);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteClass) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/classes/${deleteClass._id}`);
      setDeleteClass(null);
      fetchClasses();
    } catch (err) {
      alert('Failed to delete class.');
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (classObj) => {
    setViewClass(classObj);
  };

  // Filter classes based on search criteria
  const filteredClasses = classes.filter(cls =>
    (!searchName || cls.teacherName?.toLowerCase().includes(searchName.toLowerCase())) &&
    (!searchSubject || cls.subject?.toLowerCase().includes(searchSubject.toLowerCase()))
  );

  const renderTableHeader = () => (
    <thead>
      <tr className="bg-gray-100">
        <th className="px-2 py-2 font-medium text-left">
          <input type="checkbox" />
        </th>
        <th className="px-2 py-2 font-medium text-left">No.</th>
        <th className="px-2 py-2 font-medium text-left">Photo</th>
        <th className="px-2 py-2 font-medium text-left">Teacher Name</th>
        <th className="px-2 py-2 font-medium text-left">Gender</th>
        <th className="px-2 py-2 font-medium text-left">Subject</th>
        <th className="px-2 py-2 font-medium text-left">Class</th>
        <th className="px-2 py-2 font-medium text-left">Section</th>
        <th className="px-2 py-2 font-medium text-left">Date</th>
        <th className="px-2 py-2 font-medium text-left">Timings</th>
        <th className="px-2 py-2 font-medium text-left">Action</th>
      </tr>
    </thead>
  );

  const renderTableRow = (cls, idx) => (
    <tr key={cls._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-2 py-2 text-center">
        <input type="checkbox" />
      </td>
      <td className="px-2 py-2"># {cls.classId || idx + 1}</td>
      <td className="px-2 py-2 text-center">
        <img 
          src={cls.photo || placeholderPhoto} 
          alt="Teacher" 
          className="w-8 h-8 rounded-full object-cover mx-auto" 
        />
      </td>
      <td className="px-2 py-2">{cls.teacherName}</td>
      <td className="px-2 py-2">{cls.gender}</td>
      <td className="px-2 py-2">{cls.subject}</td>
      <td className="px-2 py-2">{cls.class}</td>
      <td className="px-2 py-2">{cls.section}</td>
      <td className="px-2 py-2">{cls.date}</td>
      <td className="px-2 py-2">{formatTimeString(cls.timings)}</td>
      <td className="px-2 py-2">
        <div className="flex gap-2 justify-center">
          <button 
            title="View" 
            onClick={() => handleView(cls)}
            className="hover:scale-110 transition-transform"
          >
            <FiEye className="text-blue-600 hover:text-blue-800" />
          </button>
          <button 
            title="Edit" 
            onClick={() => handleEdit(cls)}
            className="hover:scale-110 transition-transform"
          >
            <FiEdit2 className="text-green-600 hover:text-green-800" />
          </button>
          <button 
            title="Delete" 
            onClick={() => handleDelete(cls)}
            className="hover:scale-110 transition-transform"
          >
            <FiTrash2 className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderTableBody = () => (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={11} className="text-center py-8">Loading...</td>
        </tr>
      ) : error ? (
        <tr>
          <td colSpan={11} className="text-center text-red-600 py-8">{error}</td>
        </tr>
      ) : filteredClasses.length === 0 ? (
        <tr>
          <td colSpan={11} className="text-center text-gray-500 py-8">No classes found.</td>
        </tr>
      ) : (
        filteredClasses.map((cls, idx) => renderTableRow(cls, idx))
      )}
    </tbody>
  );

  const renderSearchBar = () => (
    <div className="flex justify-end items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Type teacher name..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ minWidth: 180 }}
      />
      <input
        type="text"
        placeholder="Type subject..."
        value={searchSubject}
        onChange={(e) => setSearchSubject(e.target.value)}
        className="border border-gray-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ minWidth: 140 }}
      />
      <button 
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-1 rounded font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors"
      >
        <FiSearch />
        SEARCH
      </button>
    </div>
  );

  const renderWindowControls = () => (
    <div className="flex gap-2">
      <button 
        title="Minimize" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiMinus size={16} />
      </button>
      <button 
        title="Maximize" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiMaximize2 size={16} />
      </button>
      <button 
        title="Close" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiX size={16} />
      </button>
    </div>
  );

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Classes</span>
          </div>
          
          {/* Main Content Card */}
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg relative px-8 pt-8 pb-12 mx-auto">
            {/* Header with breadcrumb and window controls */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-500">
              </div>
              {renderWindowControls()}
            </div>
            
            {/* Page Title */}
            <h2 className="text-lg font-semibold mb-4 mt-6">All Classes Schedule</h2>
            
            {/* Search Bar */}
            {renderSearchBar()}
            
            {/* Table */}
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-sm">
                {renderTableHeader()}
                {renderTableBody()}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for View, Edit, Delete */}
      {viewClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setViewClass(null)}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-2">Class Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-semibold">Teacher Name:</span> {viewClass.teacherName}</div>
              <div><span className="font-semibold">Gender:</span> {viewClass.gender}</div>
              <div><span className="font-semibold">ID:</span> {viewClass.classId}</div>
              <div><span className="font-semibold">Subject:</span> {viewClass.subject}</div>
              <div><span className="font-semibold">Class:</span> {viewClass.class}</div>
              <div><span className="font-semibold">Section:</span> {viewClass.section}</div>
              <div><span className="font-semibold">Date:</span> {viewClass.date}</div>
              <div><span className="font-semibold">Timings:</span> {formatTimeString(viewClass.timings)}</div>
            </div>
          </div>
        </div>
      )}
      {editClass && (
        <EditClassModal
          open={!!editClass}
          onClose={() => setEditClass(null)}
          classObj={editClass}
          onSave={async (formData, classId) => {
            setSaving(true);
            try {
              await axios.put(`http://localhost:8000/api/v1/classes/${classId}`, formData);
              setEditClass(null);
              setShowSuccessModal(true);
              fetchClasses();
            } catch (err) {
              alert('Failed to update class.');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
      {deleteClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setDeleteClass(null)}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">Delete Class</h3>
            <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteClass.teacherName}</span>'s class?</p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                onClick={() => setDeleteClass(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg px-8 py-8 flex flex-col items-center">
            <div className="text-green-700 font-bold text-lg mb-6 text-center">Class details updated successfully!</div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EditClassModal = ({ open, onClose, classObj, onSave }) => {
  const [form, setForm] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (classObj) {
      setForm({
        teacherName: classObj.teacherName || '',
        gender: classObj.gender || '',
        classId: classObj.classId || '',
        subject: classObj.subject || '',
        class: classObj.class || '',
        section: classObj.section || '',
        date: classObj.date || '',
        timings: classObj.timings || '',
      });
    }
  }, [classObj]);

  if (!open || !classObj) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getChangedFields = () => {
    const changes = [];
    Object.keys(form).forEach((key) => {
      if (form[key] !== (classObj[key] || '')) {
        changes.push({
          key,
          oldValue: classObj[key] || '',
          newValue: form[key],
        });
      }
    });
    return changes;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const changes = getChangedFields();
    setChangedFields(changes);
    setShowConfirm(true);
  };

  const handleConfirmChanges = () => {
    setShowConfirm(false);
    setShowFinalConfirm(true);
  };

  const handleFinalConfirmSave = async () => {
    setSaving(true);
    try {
      await onSave(form, classObj._id);
      setShowFinalConfirm(false);
    } catch (err) {
      setShowFinalConfirm(false);
      alert('Failed to update class.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (name) =>
    `border rounded px-3 py-2 w-full focus:outline-none transition-all ${
      focusedField === name ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
    }`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative max-h-[80vh] flex flex-col">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <h3 className="text-2xl font-bold mb-6 text-center">Edit Class</h3>
          <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {/* Teacher Name, Gender */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Teacher Name</label>
                <input
                  type="text"
                  name="teacherName"
                  value={form.teacherName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('teacherName')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('teacherName')}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('gender')}
                  required
                />
              </div>
            </div>
            {/* ID, Subject */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">ID</label>
                <input
                  type="text"
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('classId')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('classId')}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('subject')}
                  required
                />
              </div>
            </div>
            {/* Class, Section */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Class</label>
                <input
                  type="text"
                  name="class"
                  value={form.class}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('class')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('class')}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('section')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('section')}
                  required
                />
              </div>
            </div>
            {/* Date, Timings */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Date</label>
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('date')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('date')}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Timings</label>
                <input
                  type="text"
                  name="timings"
                  value={form.timings}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('timings')}
                  onBlur={() => setFocusedField('')}
                  className={inputClass('timings')}
                  required
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              >
                Save
              </button>
            </div>
          </form>
          {/* Step 1: Confirmation Modal for changed fields */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <h4 className="text-lg font-bold mb-4 text-center">Confirm Changes</h4>
                {changedFields.length === 0 ? (
                  <div className="text-center text-gray-600 mb-4">No changes detected.</div>
                ) : (
                  <div className="mb-4 max-h-60 overflow-y-auto">
                    <table className="w-full text-sm border border-gray-200 rounded">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-2 text-left font-semibold">Field</th>
                          <th className="py-2 px-2 text-left font-semibold">Old Value</th>
                          <th className="py-2 px-2 text-left font-semibold">New Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changedFields.map(({ key, oldValue, newValue }, idx) => (
                          <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-1 px-2 font-medium">{fieldLabels[key] || key}</td>
                            <td className="py-1 px-2 text-gray-500">{oldValue}</td>
                            <td className="py-1 px-2 text-blue-600">{newValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                    onClick={() => setShowConfirm(false)}
                  >
                    Back to Edit
                  </button>
                  <button
                    className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                    onClick={handleConfirmChanges}
                    disabled={changedFields.length === 0}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Step 2: Final Confirmation Modal for all fields */}
          {showFinalConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <h4 className="text-lg font-bold mb-4 text-center">Review All Details</h4>
                <div className="mb-4 max-h-60 overflow-y-auto">
                  <table className="w-full text-sm border border-gray-200 rounded">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-2 text-left font-semibold">Field</th>
                        <th className="py-2 px-2 text-left font-semibold">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(fieldLabels).map((key, idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-1 px-2 font-medium">{fieldLabels[key]}</td>
                          <td className="py-1 px-2">{form[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                    onClick={() => { setShowFinalConfirm(false); setShowConfirm(false); }}
                    disabled={saving}
                  >
                    Back to Edit
                  </button>
                  <button
                    className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                    onClick={handleFinalConfirmSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Confirm & Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllClasses;