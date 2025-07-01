import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import StudentAdmissionForm from './components/StudentAdmissionForm.jsx'
import TeacherForm from './components/TeacherForm.jsx'
import PaymentForm from './components/PaymentForm.jsx'
import StudentPromotionForm from './components/StudentPromotionForm.jsx'
import AllStudents from './components/AllStudents.jsx'
import NoticeBoard from './components/NoticeBoard.jsx'
import AddClass from './components/AddClass.jsx'

// In your main App.js or index.js

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/student-admission-form" element={<StudentAdmissionForm />} />
          <Route path="/teacher-form" element={<TeacherForm />} />
          <Route path="/payment-form" element={<PaymentForm />} />
          <Route path="/student-promotion-form" element={<StudentPromotionForm />} />
          <Route path="/all-students" element={<AllStudents />} />
          <Route path="/notice-board" element={<NoticeBoard />} />
          <Route path="/add-class" element={<AddClass />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

