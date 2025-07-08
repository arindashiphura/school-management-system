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
                            <button title="Edit" className="p-1 rounded hover:bg-green-50 transition"><FiEdit2 className="text-green-600 hover:text-green-800" size={18} /></button>
                            <button title="Delete" className="p-1 rounded hover:bg-red-50 transition"><FiTrash2 className="text-red-600 hover:text-red-800" size={18} /></button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllExpenses; 