import React, { useState, useEffect } from 'react';

const fieldLabels = {
  rollNo: 'Roll',
  studentPhoto: 'Photo',
  firstName: 'First Name',
  lastName: 'Last Name',
  gender: 'Gender',
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  class: 'Class',
  section: 'Section',
  presentAddress: 'Address',
  dob: 'Date of Birth',
  phoneNumber: 'Mobile No.',
  email: 'Email',
};

const EditStudentModal = ({ open, onClose, student, onSave, onSuccess }) => {
  const [form, setForm] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [changedFields, setChangedFields] = useState([]);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (student) {
      setForm({
        rollNo: student.rollNo || '',
        studentPhoto: student.studentPhoto || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        gender: student.gender || '',
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        class: student.class || '',
        section: student.section || '',
        presentAddress: student.presentAddress || '',
        dob: student.dob ? student.dob.slice(0, 10) : '',
        phoneNumber: student.phoneNumber || '',
        email: student.email || '',
      });
      setPhotoPreview(
        student.studentPhoto
          ? student.studentPhoto.startsWith('http')
            ? student.studentPhoto
            : `http://localhost:8000${student.studentPhoto}`
          : 'https://ui-avatars.com/api/?name=Student&background=random'
      );
    }
  }, [student]);

  if (!open || !student) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, studentPhoto: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Compare form and student, return array of changed fields
  const getChangedFields = () => {
    const changes = [];
    Object.keys(form).forEach((key) => {
      // For photo, just check if a new file is selected
      if (key === 'studentPhoto') {
        if (form.studentPhoto && form.studentPhoto !== student.studentPhoto) {
          changes.push({
            key,
            oldValue: student.studentPhoto ? 'Current Photo' : 'None',
            newValue: form.studentPhoto.name ? form.studentPhoto.name : 'New Photo',
          });
        }
      } else if (form[key] !== (student[key] || '')) {
        changes.push({
          key,
          oldValue: student[key] || '',
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
      // Prepare form data for multipart/form-data
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'studentPhoto' && form.studentPhoto instanceof File) {
          formData.append('studentPhoto', form.studentPhoto);
        } else {
          formData.append(key, form[key]);
        }
      });
      // Call onSave with formData (parent should handle API call)
      await onSave(formData, student._id);
      setShowFinalConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      // Optionally handle error
      setShowFinalConfirm(false);
      alert('Failed to update student.');
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    onClose();
    if (onSuccess) onSuccess();
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
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Student</h3>
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Roll No */}
          <div>
            <label className="block text-sm font-semibold mb-1">Roll</label>
            <input
              type="text"
              name="rollNo"
              value={form.rollNo}
              onChange={handleChange}
              onFocus={() => setFocusedField('rollNo')}
              onBlur={() => setFocusedField('')}
              className={inputClass('rollNo')}
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
          {/* Name Fields */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField('')}
                className={inputClass('firstName')}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField('')}
                className={inputClass('lastName')}
                required
              />
            </div>
          </div>
          {/* Gender, Class, Section */}
          <div className="flex gap-4">
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-1/3">
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
            <div className="w-1/3">
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
          {/* Parent's Name Fields */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fatherName')}
                onBlur={() => setFocusedField('')}
                className={inputClass('fatherName')}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={form.motherName}
                onChange={handleChange}
                onFocus={() => setFocusedField('motherName')}
                onBlur={() => setFocusedField('')}
                className={inputClass('motherName')}
              />
            </div>
          </div>
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input
              type="text"
              name="presentAddress"
              value={form.presentAddress}
              onChange={handleChange}
              onFocus={() => setFocusedField('presentAddress')}
              onBlur={() => setFocusedField('')}
              className={inputClass('presentAddress')}
              required
            />
          </div>
          {/* Date of Birth, Mobile No., Email */}
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                onFocus={() => setFocusedField('dob')}
                onBlur={() => setFocusedField('')}
                className={inputClass('dob')}
                required
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold mb-1">Mobile No.</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField('phoneNumber')}
                onBlur={() => setFocusedField('')}
                className={inputClass('phoneNumber')}
                required
              />
            </div>
            <div className="w-1/3">
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
                            {key === 'studentPhoto' ? (
                              <span>{oldValue}</span>
                            ) : (
                              <span>{oldValue}</span>
                            )}
                          </td>
                          <td className="py-1 px-2 text-blue-600">
                            {key === 'studentPhoto' ? (
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
                          {key === 'studentPhoto' ? (
                            <img
                              src={form.studentPhoto && form.studentPhoto instanceof File ? photoPreview : (form.studentPhoto ? (form.studentPhoto.startsWith ? (form.studentPhoto.startsWith('http') ? form.studentPhoto : `http://localhost:8000${form.studentPhoto}`) : form.studentPhoto) : 'https://ui-avatars.com/api/?name=Student&background=random')}
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
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
              <h4 className="text-lg font-bold mb-4 text-green-700">Student details updated successfully!</h4>
              <button
                className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-2"
                onClick={handleSuccessOk}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditStudentModal; 