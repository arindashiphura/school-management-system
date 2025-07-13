import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

const AllSubjects = ({ subjects, loading, error }) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [viewSubject, setViewSubject] = useState(null);
  const [editSubject, setEditSubject] = useState(null);
  const [deleteSubject, setDeleteSubject] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const filteredSubjects = subjects.filter(subject =>
    (!searchCode || subject.subjectCode?.toLowerCase().includes(searchCode.toLowerCase())) &&
    (!searchClass || subject.class?.toLowerCase().includes(searchClass.toLowerCase()))
  );

  const handleEditSave = async (form, id) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/subjects/${id}`, form);
      setEditSubject(null);
      setShowSuccessModal(true);
      // Do NOT reload here
    } catch (err) {
      alert('Failed to update subject.');
    }
  };
  const handleDelete = async () => {
    if (!deleteSubject) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/subjects/${deleteSubject._id}`);
      setDeleteSubject(null);
      if (typeof window !== 'undefined') window.location.reload(); // or refetch subjects if available
    } catch (err) {
      alert('Failed to delete subject.');
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg px-8 pt-8 pb-12">
      <h2 className="text-lg font-semibold mb-4">All Classes Schedule</h2>
      {/* Search Bar */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Type Code here..."
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
          style={{ minWidth: 140 }}
        />
        <input
          type="text"
          placeholder="Type Class..."
          value={searchClass}
          onChange={e => setSearchClass(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
          style={{ minWidth: 120 }}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded font-semibold flex items-center gap-1">
          <FiSearch /> SEARCH
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-base font-bold">
              <th className="px-2 py-2 font-bold text-left w-8 align-middle whitespace-nowrap"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Subject Code
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Subject Name
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Subject Type
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Class
                  <span className="flex flex-col ml-1">
                    <FiChevronUp className="-mb-1" size={14} />
                    <FiChevronDown className="-mt-1" size={14} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center text-red-600 py-8">{error}</td></tr>
            ) : filteredSubjects.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-gray-500">No subjects found.</td></tr>
            ) : (
              filteredSubjects.map((subject, idx) => (
                <tr key={subject._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-2 text-center"><input type="checkbox" /></td>
                  <td className="px-2 py-2 whitespace-nowrap"># {subject.subjectCode}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{subject.subjectName}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{subject.subjectType}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{subject.class}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button title="View" onClick={() => setViewSubject(subject)} className="p-1 rounded hover:bg-blue-50 transition"><FiEye className="text-blue-600 hover:text-blue-800" size={18} /></button>
                      <button title="Edit" onClick={() => setEditSubject(subject)} className="p-1 rounded hover:bg-green-50 transition"><FiEdit2 className="text-green-600 hover:text-green-800" size={18} /></button>
                      <button title="Delete" onClick={() => setDeleteSubject(subject)} className="p-1 rounded hover:bg-red-50 transition"><FiTrash2 className="text-red-600 hover:text-red-800" size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing subject details */}
      {viewSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setViewSubject(null)}
              title="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">{viewSubject.subjectName}</h3>
              <div className="w-full grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Subject Code:</span> {viewSubject.subjectCode}</div>
                <div><span className="font-semibold">Subject Type:</span> {viewSubject.subjectType}</div>
                <div><span className="font-semibold">Class:</span> {viewSubject.class}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editSubject && (
        <EditSubjectModal
          open={!!editSubject}
          onClose={() => setEditSubject(null)}
          subject={editSubject}
          onSave={handleEditSave}
        />
      )}
      {deleteSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setDeleteSubject(null)}
              title="Close"
            >
              &times;
            </button>
            <div className="text-center">
              <h4 className="text-lg font-bold mb-2">Delete Subject</h4>
              <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteSubject.subjectName}</span>?</p>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                  onClick={() => setDeleteSubject(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg px-8 py-8 flex flex-col items-center">
            <div className="text-green-700 font-bold text-lg mb-6 text-center">Subject details updated successfully!</div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
              onClick={() => {
                setShowSuccessModal(false);
                if (typeof window !== 'undefined') window.location.reload(); // or refetch subjects if available
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const subjectFieldLabels = {
  subjectName: 'Subject Name',
  subjectType: 'Subject Type',
  class: 'Class',
  subjectCode: 'Subject Code',
};

const EditSubjectModal = ({ open, onClose, subject, onSave }) => {
  const [form, setForm] = React.useState({});
  const [focusedField, setFocusedField] = React.useState('');
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [changedFields, setChangedFields] = React.useState([]);
  const [showFinalConfirm, setShowFinalConfirm] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (subject) {
      setForm({
        subjectName: subject.subjectName || '',
        subjectType: subject.subjectType || '',
        class: subject.class || '',
        subjectCode: subject.subjectCode || '',
      });
    }
  }, [subject]);

  if (!open || !subject) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getChangedFields = () => {
    const changes = [];
    Object.keys(form).forEach((key) => {
      if (form[key] !== (subject[key] || '')) {
        changes.push({
          key,
          oldValue: subject[key] || '',
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
      await onSave(form, subject._id);
      setShowFinalConfirm(false);
    } catch (err) {
      setShowFinalConfirm(false);
      alert('Failed to update subject.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (name) =>
    `border rounded px-3 py-2 w-full focus:outline-none transition-all ${
      focusedField === name ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative max-h-[80vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Subject</h3>
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Subject Name, Subject Type */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Subject Name</label>
              <input
                type="text"
                name="subjectName"
                value={form.subjectName}
                onChange={handleChange}
                onFocus={() => setFocusedField('subjectName')}
                onBlur={() => setFocusedField('')}
                className={inputClass('subjectName')}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Subject Type</label>
              <select
                name="subjectType"
                value={form.subjectType}
                onChange={handleChange}
                onFocus={() => setFocusedField('subjectType')}
                onBlur={() => setFocusedField('')}
                className={inputClass('subjectType')}
                required
              >
                <option value="">Select Type</option>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
          </div>
          {/* Class, Subject Code */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Class</label>
              <select
                name="class"
                value={form.class}
                onChange={handleChange}
                onFocus={() => setFocusedField('class')}
                onBlur={() => setFocusedField('')}
                className={inputClass('class')}
                required
              >
                <option value="">Select Class</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Subject Code</label>
              <input
                type="text"
                name="subjectCode"
                value={form.subjectCode}
                onChange={handleChange}
                onFocus={() => setFocusedField('subjectCode')}
                onBlur={() => setFocusedField('')}
                className={inputClass('subjectCode')}
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
                          <td className="py-1 px-2 font-medium">{subjectFieldLabels[key] || key}</td>
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
                    {Object.keys(subjectFieldLabels).map((key, idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-1 px-2 font-medium">{subjectFieldLabels[key]}</td>
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
  );
};

export default AllSubjects; 