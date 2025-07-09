import React, { useState, useEffect } from 'react';

const fieldLabels = {
  parentId: 'Parent ID',
  name: 'Name',
  gender: 'Gender',
  occupation: 'Occupation',
  address: 'Address',
  mobile: 'Mobile No.',
  email: 'Email',
  photo: 'Photo',
};

const genders = ['Male', 'Female', 'Other'];

const EditParentModal = ({ open, onClose, parent, onSave }) => {
  const [form, setForm] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (parent) {
      setForm({
        parentId: parent.parentId || '',
        name: parent.name || '',
        gender: parent.gender || '',
        occupation: parent.occupation || '',
        address: parent.address || '',
        mobile: parent.mobile || '',
        email: parent.email || '',
        photo: parent.photo || '',
      });
      setPhotoPreview(
        parent.photo
          ? parent.photo.startsWith('http')
            ? parent.photo
            : `http://localhost:8000${parent.photo}`
          : 'https://ui-avatars.com/api/?name=Parent&background=random'
      );
    }
  }, [parent]);

  if (!open || !parent) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Compare form and parent, return array of changed fields
  const getChangedFields = () => {
    const changes = [];
    Object.keys(form).forEach((key) => {
      if (key === 'photo') {
        if (form.photo && form.photo !== parent.photo) {
          changes.push({
            key,
            oldValue: parent.photo ? 'Current Photo' : 'None',
            newValue: form.photo.name ? form.photo.name : 'New Photo',
          });
        }
      } else if (form[key] !== (parent[key] || '')) {
        changes.push({
          key,
          oldValue: parent[key] || '',
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
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'photo' && form.photo instanceof File) {
          formData.append('photo', form.photo);
        } else {
          formData.append(key, form[key]);
        }
      });
      await onSave(formData, parent._id);
      setShowFinalConfirm(false);
    } catch (err) {
      setShowFinalConfirm(false);
      alert('Failed to update parent.');
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
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Parent</h3>
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Parent ID */}
          <div>
            <label className="block text-sm font-semibold mb-1">Parent ID</label>
            <input
              type="text"
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              onFocus={() => setFocusedField('parentId')}
              onBlur={() => setFocusedField('')}
              className={inputClass('parentId')}
              required
            />
          </div>
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">Photo</label>
            <div className="flex items-center gap-4">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block text-sm"
              />
            </div>
          </div>
          {/* Name, Gender */}
          <div className="flex gap-4">
            <div className="w-2/3">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('')}
                className={inputClass('name')}
                required
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                onFocus={() => setFocusedField('gender')}
                onBlur={() => setFocusedField('')}
                className={inputClass('gender')}
                required
              >
                <option value="">Select</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          {/* Occupation, Address */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                onFocus={() => setFocusedField('occupation')}
                onBlur={() => setFocusedField('')}
                className={inputClass('occupation')}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField('')}
                className={inputClass('address')}
                required
              />
            </div>
          </div>
          {/* Mobile, Email */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Mobile No.</label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                onFocus={() => setFocusedField('mobile')}
                onBlur={() => setFocusedField('')}
                className={inputClass('mobile')}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={inputClass('email')}
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
                          <td className="py-1 px-2 text-gray-500">
                            {key === 'photo' ? (
                              <span>{oldValue}</span>
                            ) : (
                              <span>{oldValue}</span>
                            )}
                          </td>
                          <td className="py-1 px-2 text-blue-600">
                            {key === 'photo' ? (
                              <span>{newValue}</span>
                            ) : (
                              <span>{newValue}</span>
                            )}
                          </td>
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
                        <td className="py-1 px-2">
                          {key === 'photo' ? (
                            <img
                              src={form.photo && form.photo instanceof File ? photoPreview : (form.photo ? (form.photo.startsWith ? (form.photo.startsWith('http') ? form.photo : `http://localhost:8000${form.photo}`) : form.photo) : 'https://ui-avatars.com/api/?name=Parent&background=random')}
                              alt="Preview"
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <span>{form[key]}</span>
                          )}
                        </td>
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

export default EditParentModal; 