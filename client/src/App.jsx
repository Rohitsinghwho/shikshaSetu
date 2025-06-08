
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirects


import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import StudentRegister from './pages/StudentRegister.jsx';
import TutorRegister from './pages/TutorRegister.jsx';
import StudentLanding from './pages/StudentLanding.jsx'; 
// import TutorDashboard from './pages/TutorDashboard'; 
// import NotFoundPage from './pages/NotFoundPage'; 

import { AuthProvider} from './contexts/AuthContexts.jsx'; 
import { useAuth } from './contexts/contextProvider.js';
import Booking from './components/Booking.jsx';
import { BookingProvider } from './contexts/BookingContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MySessions from './pages/MySessions.jsx';
import TutorLanding from './pages/TutorLanding.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth(); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {

    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.warn(`User role '${user.role}' not allowed for this route. Access denied.`);
    return <Navigate to="/" replace />; 
  }

  return children; 
};


const App = () => {
  return (
   
    <AuthProvider>
      <BookingProvider>
      <Router>
      <Header/>
        <Routes>
         
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} /> 
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/tutor/register" element={<TutorRegister />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student-dashboard/book-session'
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Booking/>
              </ProtectedRoute>
            }
            />
          <Route
            path='/tutor-dashboard'
            element={
              <ProtectedRoute allowedRoles={['tutor']}>
                <TutorLanding/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-my-sessions"
            element={
              <ProtectedRoute allowedRoles={['student',['tutor']]}>
                <MySessions />
              </ProtectedRoute>
            }
          />

          
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      <Footer/>
      </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;