import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SubjectForm from './SubjectForm';
import AllSubjects from './AllSubjects';
import axios from 'axios';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/v1/subjects');
      setSubjects(res.data.subjects || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch subjects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubjectAdded = () => {
    fetchSubjects();
    setSuccessMsg('Subject added successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="ml-64 flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="bg-gray-100 py-8 px-2 min-h-screen">
          {/* Breadcrumb */}
          <div className="mb-2 text-sm text-gray-500">
            Home &gt; <span className="text-blue-600 cursor-pointer">Subjects</span>
          </div>
          <div className="flex items-start gap-8">
            <SubjectForm onSubjectAdded={handleSubjectAdded} successMsg={successMsg} />
            <AllSubjects subjects={subjects} loading={loading} error={error} refreshSubjects={fetchSubjects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage; 