import React, { useState, useEffect } from 'react';

const fieldLabels = {
  bookName: 'Book Name',
  subject: 'Subject',
  writerName: 'Writer Name',
  class: 'Class',
  publishingYear: 'Publishing Year',
  uploadDate: 'Upload Date',
  idNo: 'ID No.',
};

const EditBookModal = ({ open, onClose, book, onSave }) => {
  const [form, setForm] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setForm({
        bookName: book.bookName || '',
        subject: book.subject || '',
        writerName: book.writerName || '',
        class: book.class || '',
        publishingYear: book.publishingYear || '',
        uploadDate: book.uploadDate ? book.uploadDate.slice(0, 10) : '',
        idNo: book.idNo || '',
      });
    }
  }, [book]);

  if (!open || !book) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Compare form and book, return array of changed fields
  const getChangedFields = () => {
    const changes = [];
    Object.keys(form).forEach((key) => {
      if (form[key] !== (book[key] || '')) {
        changes.push({
          key,
          oldValue: book[key] || '',
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

  // Step 1: Confirm changed fields
  const handleConfirmChanges = () => {
    setShowConfirm(false);
    setShowFinalConfirm(true);
  };

  // Step 2: Confirm all fields (final values)
  const handleFinalConfirmSave = async () => {
    setSaving(true);
    try {
      await onSave(form, book._id);
      setShowFinalConfirm(false);
    } catch (err) {
      setShowFinalConfirm(false);
      alert('Failed to update book.');
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
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Book</h3>
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Book Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Book Name</label>
            <input
              type="text"
              name="bookName"
              value={form.bookName}
              onChange={handleChange}
              onFocus={() => setFocusedField('bookName')}
              onBlur={() => setFocusedField('')}
              className={inputClass('bookName')}
              required
            />
          </div>
          {/* Subject, Writer Name */}
          <div className="flex gap-4">
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
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Writer Name</label>
              <input
                type="text"
                name="writerName"
                value={form.writerName}
                onChange={handleChange}
                onFocus={() => setFocusedField('writerName')}
                onBlur={() => setFocusedField('')}
                className={inputClass('writerName')}
                required
              />
            </div>
          </div>
          {/* Class, Publishing Year */}
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
              <label className="block text-sm font-semibold mb-1">Publishing Year</label>
              <input
                type="text"
                name="publishingYear"
                value={form.publishingYear}
                onChange={handleChange}
                onFocus={() => setFocusedField('publishingYear')}
                onBlur={() => setFocusedField('')}
                className={inputClass('publishingYear')}
                required
              />
            </div>
          </div>
          {/* Upload Date, ID No. */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Upload Date</label>
              <input
                type="date"
                name="uploadDate"
                value={form.uploadDate}
                onChange={handleChange}
                onFocus={() => setFocusedField('uploadDate')}
                onBlur={() => setFocusedField('')}
                className={inputClass('uploadDate')}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">ID No.</label>
              <input
                type="text"
                name="idNo"
                value={form.idNo}
                onChange={handleChange}
                onFocus={() => setFocusedField('idNo')}
                onBlur={() => setFocusedField('')}
                className={inputClass('idNo')}
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
  );
};

export default EditBookModal; 