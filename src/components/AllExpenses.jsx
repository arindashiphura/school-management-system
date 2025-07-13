import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const statusColors = {
  Paid: 'bg-green-600',
  Due: 'bg-red-600',
  Pending: 'bg-yellow-500',
};

const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [viewExpense, setViewExpense] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/expenses');
      setExpenses(res.data.expenses || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch expenses.');
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    (!searchId || expense.id?.toLowerCase().includes(searchId.toLowerCase())) &&
    (!searchMobile || expense.phone?.toLowerCase().includes(searchMobile.toLowerCase()))
  );

  // Edit handler
  const handleEditSave = async (form, id) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/expenses/${id}`, form);
      setEditExpense(null);
      setShowSuccessModal(true);
      fetchExpenses();
    } catch (err) {
      alert('Failed to update expense.');
    }
  };
  // Delete handler
  const handleDelete = async () => {
    if (!deleteExpense) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/expenses/${deleteExpense._id}`);
      setDeleteExpense(null);
      fetchExpenses();
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">All Expenses</span>
          </div>
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg px-8 pt-8 pb-12 mx-auto mt-4">
            <h2 className="text-lg font-bold mb-4 text-left">All Expenses List</h2>
            {/* Search Bar */}
            <div className="flex justify-end items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Type ID here..."
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 180 }}
              />
              <input
                type="text"
                placeholder="Type Mobile No..."
                value={searchMobile}
                onChange={e => setSearchMobile(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded text-sm"
                style={{ minWidth: 140 }}
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
                        ID
                        <span className="flex flex-col ml-1">
                          <FiChevronUp className="-mb-1" size={14} />
                          <FiChevronDown className="-mt-1" size={14} />
                        </span>
                      </div>
                    </th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Expense Type
                        <span className="flex flex-col ml-1">
                          <FiChevronUp className="-mb-1" size={14} />
                          <FiChevronDown className="-mt-1" size={14} />
                        </span>
                      </div>
                    </th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Name
                        <span className="flex flex-col ml-1">
                          <FiChevronUp className="-mb-1" size={14} />
                          <FiChevronDown className="-mt-1" size={14} />
                        </span>
                      </div>
                    </th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Amount
                        <span className="flex flex-col ml-1">
                          <FiChevronUp className="-mb-1" size={14} />
                          <FiChevronDown className="-mt-1" size={14} />
                        </span>
                      </div>
                    </th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Status
                        <span className="flex flex-col ml-1">
                          <FiChevronUp className="-mb-1" size={14} />
                          <FiChevronDown className="-mt-1" size={14} />
                        </span>
                      </div>
                    </th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Mobile No.
                        <span className="flex flex-col ml-1">
                          <FiChevronUp className="-mb-1" size={14} />
                          <FiChevronDown className="-mt-1" size={14} />
                        </span>
                      </div>
                    </th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">Email</th>
                    <th className="px-2 py-2 font-bold text-left align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Date
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
                    <tr><td colSpan={10} className="text-center py-8">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={10} className="text-center text-red-600 py-8">{error}</td></tr>
                  ) : filteredExpenses.length === 0 ? (
                    <tr><td colSpan={10} className="text-center text-gray-500">No expenses found.</td></tr>
                  ) : (
                    filteredExpenses.map((expense, idx) => (
                      <tr key={expense._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 py-2 text-center"><input type="checkbox" /></td>
                        <td className="px-2 py-2 whitespace-nowrap"># {expense.id}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{expense.expenseType}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{expense.name}</td>
                        <td className="px-2 py-2 whitespace-nowrap">${expense.amount}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${statusColors[expense.status] || 'bg-gray-400'}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">{expense.phone}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{expense.email}</td>
                        <td className="px-2 py-2 whitespace-nowrap">{expense.date ? new Date(expense.date).toLocaleDateString('en-GB') : '-'}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button title="View" onClick={() => setViewExpense(expense)} className="p-1 rounded hover:bg-blue-50 transition"><FiEye className="text-blue-600 hover:text-blue-800" size={18} /></button>
                            <button title="Edit" onClick={() => setEditExpense(expense)} className="p-1 rounded hover:bg-green-50 transition"><FiEdit2 className="text-green-600 hover:text-green-800" size={18} /></button>
                            <button title="Delete" onClick={() => setDeleteExpense(expense)} className="p-1 rounded hover:bg-red-50 transition"><FiTrash2 className="text-red-600 hover:text-red-800" size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Modal for viewing expense details */}
            {viewExpense && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => setViewExpense(null)}
                    title="Close"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-2">{viewExpense.name}</h3>
                    <div className="w-full grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">ID:</span> {viewExpense.id}</div>
                      <div><span className="font-semibold">Expense Type:</span> {viewExpense.expenseType}</div>
                      <div><span className="font-semibold">Amount:</span> ${viewExpense.amount}</div>
                      <div><span className="font-semibold">Status:</span> {viewExpense.status}</div>
                      <div><span className="font-semibold">Mobile No.:</span> {viewExpense.phone}</div>
                      <div><span className="font-semibold">Email:</span> {viewExpense.email}</div>
                      <div><span className="font-semibold">Date:</span> {viewExpense.date ? new Date(viewExpense.date).toLocaleDateString('en-GB') : '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {editExpense && (
              <EditExpenseModal
                open={!!editExpense}
                onClose={() => setEditExpense(null)}
                expense={editExpense}
                onSave={handleEditSave}
              />
            )}
            {deleteExpense && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => setDeleteExpense(null)}
                    title="Close"
                  >
                    &times;
                  </button>
                  <div className="text-center">
                    <h4 className="text-lg font-bold mb-2">Delete Expense</h4>
                    <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteExpense.name}</span>?</p>
                    <div className="flex justify-center gap-3 mt-4">
                      <button
                        className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
                        onClick={() => setDeleteExpense(null)}
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
                  <div className="text-green-700 font-bold text-lg mb-6 text-center">Expense details updated successfully!</div>
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
        </div>
      </div>
    </div>
  );
};

const expenseFieldLabels = {
  id: 'ID',
  expenseType: 'Expense Type',
  name: 'Name',
  amount: 'Amount',
  status: 'Status',
  phone: 'Mobile No.',
  email: 'Email',
  date: 'Date',
};

const EditExpenseModal = ({ open, onClose, expense, onSave }) => {
  const [form, setForm] = React.useState({});
  const [focusedField, setFocusedField] = React.useState('');
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [changedFields, setChangedFields] = React.useState([]);
  const [showFinalConfirm, setShowFinalConfirm] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (expense) {
      setForm({
        id: expense.id || '',
        expenseType: expense.expenseType || '',
        name: expense.name || '',
        amount: expense.amount || '',
        status: expense.status || '',
        phone: expense.phone || '',
        email: expense.email || '',
        date: expense.date ? expense.date.slice(0, 10) : '',
      });
    }
  }, [expense]);

  if (!open || !expense) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getChangedFields = () => {
    const changes = [];
    Object.keys(form).forEach((key) => {
      if (form[key] !== (expense[key] || '')) {
        changes.push({
          key,
          oldValue: expense[key] || '',
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
      await onSave(form, expense._id);
      setShowFinalConfirm(false);
    } catch (err) {
      setShowFinalConfirm(false);
      alert('Failed to update expense.');
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
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* ID, Expense Type */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                onFocus={() => setFocusedField('id')}
                onBlur={() => setFocusedField('')}
                className={inputClass('id')}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Expense Type</label>
              <input
                type="text"
                name="expenseType"
                value={form.expenseType}
                onChange={handleChange}
                onFocus={() => setFocusedField('expenseType')}
                onBlur={() => setFocusedField('')}
                className={inputClass('expenseType')}
                required
              />
            </div>
          </div>
          {/* Name, Amount */}
          <div className="flex gap-4">
            <div className="w-1/2">
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
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                onFocus={() => setFocusedField('amount')}
                onBlur={() => setFocusedField('')}
                className={inputClass('amount')}
                required
              />
            </div>
          </div>
          {/* Status, Mobile No. */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                onFocus={() => setFocusedField('status')}
                onBlur={() => setFocusedField('')}
                className={inputClass('status')}
                required
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Mobile No.</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField('')}
                className={inputClass('phone')}
                required
              />
            </div>
          </div>
          {/* Email, Date */}
          <div className="flex gap-4">
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
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                onFocus={() => setFocusedField('date')}
                onBlur={() => setFocusedField('')}
                className={inputClass('date')}
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
                          <td className="py-1 px-2 font-medium">{expenseFieldLabels[key] || key}</td>
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
                    {Object.keys(expenseFieldLabels).map((key, idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-1 px-2 font-medium">{expenseFieldLabels[key]}</td>
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

export default AllExpenses; 