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
import AllClasses from './components/AllClasses.jsx'
import AllParents from './components/AllParents.jsx'
import AllTeachers from './components/AllTeachers.jsx'
import BookForm from './components/BookForm.jsx'
import AllBooks from './components/AllBooks.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import AllExpenses from './components/AllExpenses.jsx'




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
          <Route path="/all-classes" element={<AllClasses />} />
          <Route path="/all-parents" element={<AllParents />} />
          <Route path="/all-teachers" element={<AllTeachers />} />
          <Route path="/book-form" element={<BookForm />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/expense-form" element={<ExpenseForm />} />
          <Route path="/all-expenses" element={<AllExpenses />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

