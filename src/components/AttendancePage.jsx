import React, { useState, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// Utility to get number of days in a month
function getDaysInMonth(month, year) {
  if (!month || !year) return 30; // fallback
  return new Date(Number(year), Number(month), 0).getDate();
}

const classOptions = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
  { value: '3', label: 'Three' },
  { value: '4', label: 'Four' },
  { value: '5', label: 'Five' },
];
const sectionOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];
const monthOptions = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => ({
  value: (currentYear - 2 + i).toString(),
  label: (currentYear - 2 + i).toString(),
}));

const AttendancePage = () => {
  // Filter states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Data states
  const [students, setStudents] = useState([]); // Real data only
  const [attendance, setAttendance] = useState([]); // Real data only
  // Modal state for marking attendance
  const [modal, setModal] = useState({ open: false, studentIdx: null, dayIdx: null });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Track if a search was performed
  const attendanceSheetRef = useRef(null);

  // Calculate days in selected month/year
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  // Fetch students and attendance from backend
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    setStudents([]);
    setAttendance([]);
    try {
      // Fetch students
      const studentsRes = await fetch(
        `/api/students?class=${selectedClass}&section=${selectedSection}&year=${selectedYear}`
      );
      const studentsData = await studentsRes.json();
      const fetchedStudents = studentsData.students || [];
      setStudents(fetchedStudents);

      // Fetch attendance records
      const attendanceRes = await fetch(
        `/api/v1/attendance?class=${selectedClass}&section=${selectedSection}&month=${selectedMonth}&year=${selectedYear}`
      );
      const attendanceData = await attendanceRes.json();
      const attendanceRecords = attendanceData.attendance || [];

      // Build attendance matrix
      const attendanceMatrix = fetchedStudents.map(student => {
        const row = Array(daysInMonth).fill(null);
        attendanceRecords
          .filter(a => (a.student._id || a.student) === student._id)
          .forEach(a => {
            const day = new Date(a.date).getDate() - 1;
            row[day] = a.status === 'present' ? true : false;
          });
        return row;
      });
      setAttendance(attendanceMatrix);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // Handler for clicking an empty cell
  const handleCellClick = (studentIdx, dayIdx) => {
    setModal({ open: true, studentIdx, dayIdx });
  };

  // Handler for marking present/absent and saving to backend
  const handleMark = async (status) => {
    const student = students[modal.studentIdx];
    const day = modal.dayIdx + 1;
    const date = new Date(selectedYear, selectedMonth - 1, day);

    // Save to backend
    await fetch('/api/v1/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: student._id,
        class: selectedClass,
        section: selectedSection,
        date,
        status: status === 'present' ? 'present' : 'absent',
      }),
    });

    // Update UI
    setAttendance(prev => {
      const updated = prev.map((row, i) =>
        i === modal.studentIdx
          ? row.map((val, j) => (j === modal.dayIdx ? (status === 'present' ? true : false) : val))
          : row
      );
      return updated;
    });
    setModal({ open: false, studentIdx: null, dayIdx: null });
  };

  // Handler to close modal without marking
  const handleCloseModal = () => {
    setModal({ open: false, studentIdx: null, dayIdx: null });
  };

  // Print only the attendance sheet section
  const handlePrint = () => {
    if (!attendanceSheetRef.current) return;
    const printContents = attendanceSheetRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // To restore event handlers
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="flex-1 overflow-auto bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">Home &gt; <span className="text-blue-600 cursor-pointer">Attendance</span></div>
          {/* Filter Bar */}
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg px-8 pt-8 pb-6 mx-auto mt-4">
            <h2 className="text-lg font-semibold mb-4">Checkout Student Attendance</h2>
            <form className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4" onSubmit={handleSearch}>
              <div>
                <label className="block text-xs font-medium mb-1">Select Class</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {classOptions.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Select Section</label>
                <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {sectionOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Select Month</label>
                <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {monthOptions.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Session Year</label>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full bg-gray-100 border-none rounded px-3 py-2 text-sm">
                  <option value="">Select</option>
                  {yearOptions.map(y => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="bg-orange-500 text-white font-bold px-8 py-2 rounded shadow hover:bg-orange-600" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              <span className="ml-4 text-orange-500 font-semibold">Loading...</span>
            </div>
          )}
          {/* No students found message */}
          {searched && !loading && students.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <span className="text-gray-500 text-lg font-semibold">No students found for selected filters.</span>
            </div>
          )}
          {/* Attendance Table - only show if students are present */}
          {students.length > 0 && !loading && (
            <div ref={attendanceSheetRef} className="w-full max-w-7xl bg-white rounded-lg shadow-lg px-8 pt-8 pb-12 mx-auto mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Attendance Sheet of Class {selectedClass}: Section {selectedSection}, {monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </h2>
                <button onClick={handlePrint} className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800">Print Attendance Sheet</button>
              </div>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-2 py-2 font-bold text-left border-r border-gray-200">Students</th>
                      {[...Array(daysInMonth)].map((_, i) => (
                        <th key={i} className="px-2 py-2 font-bold text-center border-r border-gray-200">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, rowIdx) => (
                      <tr key={student._id} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50 border-b border-gray-200'}>
                        <td className="px-2 py-2 font-semibold whitespace-nowrap border-r border-gray-200">{student.name}</td>
                        {attendance[rowIdx]?.map((status, colIdx) => (
                          <td key={colIdx} className="px-2 py-2 text-center border-r border-gray-200">
                            {status === true ? (
                              <span className="text-green-600 text-xl font-bold">&#10003;</span>
                            ) : status === false ? (
                              <span className="text-red-600 text-xl font-bold">&#10007;</span>
                            ) : (
                              <button
                                className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-200"
                                onClick={() => handleCellClick(rowIdx, colIdx)}
                                aria-label="Mark Attendance"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Modal for marking attendance */}
          {modal.open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 min-w-[220px] flex flex-col items-center">
                <div className="mb-4 text-lg font-semibold">Mark Attendance</div>
                <div className="flex gap-4 mb-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
                    onClick={() => handleMark('present')}
                  >Present</button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
                    onClick={() => handleMark('absent')}
                  >Absent</button>
                </div>
                <button className="text-gray-500 hover:text-gray-700 text-sm" onClick={handleCloseModal}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage; 