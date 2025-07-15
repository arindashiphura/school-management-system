import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiEdit, FiTrash2, FiEye, FiMinus, FiRefreshCw, FiX } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const statusColors = {
  Paid: 'bg-green-600',
  Due: 'bg-red-600',
  Pending: 'bg-yellow-500',
  Overdue: 'bg-red-700', // Add more if needed
};

const FeesCollectionTable = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRoll, setFilterRoll] = useState('');
  const [filterSection, setFilterSection] = useState('');
  // Modal/dialog state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Helper to get the latest payment for a student, matching ObjectIds as strings
  const getLatestPayment = (student) => {
    const studentPayments = payments.filter(
      p => (p.studentId && p.studentId.toString() === student._id.toString()) || p.rollNo === student.rollNo
    );
    if (studentPayments.length === 0) return null;
    // Sort by date descending
    return studentPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  // Get payment status for a student
  const getPaymentStatus = (student) => {
    const latest = getLatestPayment(student);
    if (!latest) return 'Due';
    if (latest.status) return latest.status;
    // Fallback logic
    const totalPaid = payments.filter(
      p => p.studentId === student._id || p.rollNo === student.rollNo
    ).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    if (totalPaid >= Number(student.fee || 0)) return 'Paid';
    if (totalPaid > 0) return 'Pending';
    return 'Due';
  };

  // Filter students by roll and section
  const filteredStudents = students.filter(student =>
    (!filterRoll || (student.rollNo && student.rollNo.toLowerCase().includes(filterRoll.toLowerCase()))) &&
    (!filterSection || (student.section && student.section.toLowerCase().includes(filterSection.toLowerCase())))
  );

  // Refresh data
  const fetchData = async () => {
    setLoading(true);
    const [studentsRes, paymentsRes] = await Promise.all([
      axios.get('http://localhost:8000/api/v1/students/all'),
      axios.get('http://localhost:8000/api/v1/payments'),
    ]);
    setStudents(studentsRes.data.students || []);
    setPayments(paymentsRes.data.payments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // View handler
  const handleView = (student, payment) => {
    setSelectedStudent(student);
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  // Edit handler
  const handleEdit = (student, payment) => {
    setSelectedStudent(student);
    setSelectedPayment(payment);
    setEditForm(payment ? { ...payment } : {});
    setEditModalOpen(true);
  };

  // Edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/v1/payments/${editForm._id}`, editForm);
      setEditModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to update payment.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handler
  const handleDelete = (student, payment) => {
    setSelectedStudent(student);
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/payments/${selectedPayment._id}`);
      setDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to delete payment.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading fees data..." />;

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Fees Collection</span>
          </div>
          <div className="flex gap-2 mb-4 justify-end items-center bg-gray-50 p-2 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Type Roll No..."
              value={filterRoll}
              onChange={e => setFilterRoll(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Type Section..."
              value={filterSection}
              onChange={e => setFilterSection(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <button
              onClick={() => {
                setFilterRoll('');
                setFilterSection('');
              }}
              className="bg-blue-600 text-white px-4 py-1 rounded font-semibold shadow hover:bg-blue-700"
            >
              SEARCH
            </button>
            <button
              title="Minimize"
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-gray-700 border border-gray-200 rounded p-1"
            >
              <FiMinus size={18} />
            </button>
            <button
              title="Reload"
              onClick={fetchData}
              className="text-gray-500 hover:text-gray-700 border border-gray-200 rounded p-1"
            >
              <FiRefreshCw size={18} />
            </button>
            <button
              title="Close"
              onClick={() => setIsClosed(true)}
              className="text-gray-500 hover:text-gray-700 border border-gray-200 rounded p-1"
            >
              <FiX size={18} />
            </button>
          </div>
          {!isClosed && (
            <div className={`bg-white rounded-lg shadow-lg max-w-7xl w-full mx-auto p-8 relative ${
              isMinimized ? 'h-16 overflow-hidden' : ''
            }`}>
              <h2 className="text-xl font-bold mb-2">Students Collection Fees Table</h2>
              <hr className="mb-6 border-gray-200" />
              {/* Search/Filter Bar */}
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-2 font-medium text-left">Roll</th>
                      <th className="px-2 py-2 font-medium text-left">Photo</th>
                      <th className="px-2 py-2 font-medium text-left">Name</th>
                      <th className="px-2 py-2 font-medium text-left">Gender</th>
                      <th className="px-2 py-2 font-medium text-left">Parent's Name</th>
                      <th className="px-2 py-2 font-medium text-left">Class</th>
                      <th className="px-2 py-2 font-medium text-left">Section</th>
                      <th className="px-2 py-2 font-medium text-left">Fees</th>
                      <th className="px-2 py-2 font-medium text-left">Payment Method</th>
                      <th className="px-2 py-2 font-medium text-left">Status</th>
                      <th className="px-2 py-2 font-medium text-left">Mobile No.</th>
                      <th className="px-2 py-2 font-medium text-left">Email</th>
                      <th className="px-2 py-2 font-medium text-left">Date</th>
                      <th className="px-2 py-2 font-medium text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, idx) => {
                      const latestPayment = getLatestPayment(student);
                      return (
                        <tr key={student._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-2 py-2">{student.rollNo}</td>
                          <td className="px-2 py-2 text-center">
                            <img
                              src={
                                student.studentPhoto
                                  ? student.studentPhoto.startsWith('http')
                                    ? student.studentPhoto
                                    : `http://localhost:8000${student.studentPhoto}`
                                  : 'https://ui-avatars.com/api/?name=Student&background=random'
                              }
                              alt="Student"
                              className="w-8 h-8 rounded-full object-cover mx-auto"
                            />
                          </td>
                          <td className="px-2 py-2">{student.firstName} {student.lastName}</td>
                          <td className="px-2 py-2">{student.gender}</td>
                          <td className="px-2 py-2">{student.fatherName || student.parentName || '-'}</td>
                          <td className="px-2 py-2">{student.class}</td>
                          <td className="px-2 py-2">{student.section}</td>
                          <td className="px-2 py-2">{latestPayment ? latestPayment.amount : '-'}</td>
                          <td className="px-2 py-2">{latestPayment ? latestPayment.paymentMethod : '-'}</td>
                          <td className="px-2 py-2">
                            {/* Status badge with dynamic color and capitalization, treat null/empty as NILL, no payment as empty */}
                            {latestPayment ? (
                              <span
                                className={`px-3 py-1 rounded text-white font-semibold ${
                                  latestPayment.status
                                    ? statusColors[
                                        latestPayment.status.charAt(0).toUpperCase() + latestPayment.status.slice(1).toLowerCase()
                                      ] || 'bg-gray-300'
                                    : 'bg-green-600' // NILL is green
                                }`}
                              >
                                {latestPayment.status
                                  ? latestPayment.status.charAt(0).toUpperCase() + latestPayment.status.slice(1).toLowerCase()
                                  : 'NILL'}
                              </span>
                            ) : (
                              '' // No payment: show empty cell
                            )}
                          </td>
                          <td className="px-2 py-2">{student.phoneNumber}</td>
                          <td className="px-2 py-2">{student.email}</td>
                          <td className="px-2 py-2">{latestPayment && latestPayment.date ? new Date(latestPayment.date).toLocaleDateString('en-GB') : '-'}</td>
                          <td className="px-2 py-2 flex gap-2 justify-center">
                            <button title="View" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => handleView(student, latestPayment)}>
                              <FiEye className="text-blue-600 hover:text-blue-800" />
                            </button>
                            <button title="Edit" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => handleEdit(student, latestPayment)}>
                              <FiEdit className="text-green-600 hover:text-green-800" />
                            </button>
                            <button title="Delete" className="hover:scale-110 transition-transform cursor-pointer" onClick={() => handleDelete(student, latestPayment)}>
                              <FiTrash2 className="text-red-600 hover:text-red-800" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modals and dialogs */}
      {viewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold" onClick={() => setViewModalOpen(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4 text-center">Student & Payment Details</h3>
            <div className="mb-2"><b>Name:</b> {selectedStudent.firstName} {selectedStudent.lastName}</div>
            <div className="mb-2"><b>Roll No:</b> {selectedStudent.rollNo}</div>
            <div className="mb-2"><b>Class:</b> {selectedStudent.class}</div>
            <div className="mb-2"><b>Section:</b> {selectedStudent.section}</div>
            <div className="mb-2"><b>Payment Amount:</b> {selectedPayment ? selectedPayment.amount : '-'}</div>
            <div className="mb-2"><b>Payment Method:</b> {selectedPayment ? selectedPayment.paymentMethod : '-'}</div>
            <div className="mb-2"><b>Status:</b> {selectedPayment ? (selectedPayment.status || 'NILL') : '-'}</div>
            <div className="mb-2"><b>Date:</b> {selectedPayment && selectedPayment.date ? new Date(selectedPayment.date).toLocaleDateString('en-GB') : '-'}</div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold" onClick={() => setEditModalOpen(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4 text-center">Edit Payment</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1">Amount</label>
                <input name="amount" value={editForm.amount || ''} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1">Payment Method</label>
                <input name="paymentMethod" value={editForm.paymentMethod || ''} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1">Status</label>
                <select name="status" value={editForm.status || ''} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">NILL</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1">Date</label>
                <input name="date" type="date" value={editForm.date ? editForm.date.slice(0,10) : ''} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={editLoading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold">
                  {editLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Dialog */}
      {deleteDialogOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <h4 className="text-lg font-bold mb-4 text-red-700">Are you sure you want to delete this payment?</h4>
            <div className="mb-4 text-gray-700">Amount: {selectedPayment.amount} | Date: {selectedPayment.date ? new Date(selectedPayment.date).toLocaleDateString('en-GB') : '-'}</div>
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>Cancel</button>
              <button className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesCollectionTable; 