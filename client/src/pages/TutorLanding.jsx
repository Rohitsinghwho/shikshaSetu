import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/contextProvider.js'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { useBook } from '../contexts/bookingProvider.js';

export default function TutorLanding() { 
  const navigate = useNavigate(); 
  const { user, loading: authLoading } = useAuth();
  const { bookings, loadingBookings, bookingsError, updateBookingStatus } = useBook();
  const [GettutorSessions,setTutorSessions]=useState([]);
  useEffect(()=>{
    const fetchSessions=async()=>{
        const query={
            role:'tutor'
        }
        try {
            const response=await axios.post('/api/sessions/getSession?role=tutor');
            if(response.data){
                setTutorSessions(response.data);
            }
        } catch (error) {
            console.log("unable to fetch")
        }
    }
    fetchSessions();
  },[authLoading])
  const tutorSessions = GettutorSessions.filter(session => 
    user && session.tutor && session.tutor._id === user._id
  );

  const pendingSessions = tutorSessions.filter(session => session.status === 'Pending');
  const acceptedSessions = tutorSessions.filter(session => session.status === 'Accepted');
  const rejectedSessions = tutorSessions.filter(session => session.status === 'Rejected');


  const handleSessionAction = async (sessionId, newStatus) => {
    try {
      const response = await axios.put(`/api/sessions/${sessionId}/status`, { status: newStatus });
      
      if (response.status === 200) {
        updateBookingStatus(sessionId, newStatus);
        alert(`Session ${sessionId} ${newStatus.toLowerCase()} successfully!`);
      } else {
        alert(`Failed to ${newStatus.toLowerCase()} session. Please try again.`);
      }
    } catch (error) {
      console.error(`Error updating session status to ${newStatus}:`, error.response ? error.response.data : error.message);
      alert(`Error: Could not update session status. ${error.response?.data?.message || error.message}`);
    }
  };

  if (authLoading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading tutor dashboard...</p>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 text-lg p-6">
        <p>{bookingsError}</p>
      </div>
    );
  }

  if (!user || user.role !== 'tutor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 text-lg p-6">
        <p>Access Denied: You must be logged in as a tutor to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Welcome, {user.name || user.email}! <span className="text-indigo-600"></span>
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              {user.subjects && user.subjects.length > 0 && (
                <p><span className="font-semibold">Subjects:</span> {user.subjects.join(', ')}</p>
              )}
              {user.languages && user.languages.length > 0 && (
                <p><span className="font-semibold">Languages:</span> {user.languages.join(', ')}</p>
              )}
            </div>
            <div>
              <p><span className="font-semibold">Rating:</span> {'⭐'.repeat(Math.round(user.rating))} {user.rating?.toFixed(1) || 'N/A'} / 5</p>
              <p><span className="font-semibold">Sessions Completed:</span> {user.sessionsCompleted || 0}</p>
              {user.availability && user.availability.length > 0 && (
                <p><span className="font-semibold">Availability:</span> {user.availability.join(', ')}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Pending Session Requests ({pendingSessions.length})</h2>
            {pendingSessions.length === 0 ? (
              <p className="text-gray-600">No new session requests at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingSessions.map(session => (
                  <div key={session._id} className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
                    <h3 className="text-lg font-semibold text-yellow-900">{session.subject}</h3>
                    <p className="text-sm text-gray-700">Student: {session.student ? session.student.name || session.student.email : 'N/A'}</p>
                    <p className="text-sm text-gray-700">Scheduled: {new Date(session.scheduledTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-700 mb-3">Description: {session.description || 'N/A'}</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSessionAction(session._id, 'Accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleSessionAction(session._id, 'Rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Accepted Sessions ({acceptedSessions.length})</h2>
            {acceptedSessions.length === 0 ? (
              <p className="text-gray-600">No accepted sessions yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {acceptedSessions.map(session => (
                  <div key={session._id} className="border border-blue-300 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-lg font-semibold text-blue-900">{session.subject}</h3>
                    <p className="text-sm text-gray-700">Student: {session.student ? session.student.name || session.student.email : 'N/A'}</p>
                    <p className="text-sm text-gray-700">Scheduled: {new Date(session.scheduledTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-700 mb-3">Description: {session.description || 'N/A'}</p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rejected Sessions ({rejectedSessions.length})</h2>
            {rejectedSessions.length === 0 ? (
              <p className="text-gray-600">No rejected sessions.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rejectedSessions.map(session => (
                  <div key={session._id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">{session.subject}</h3>
                    <p className="text-sm text-gray-700">Student: {session.student ? session.student.name || session.student.email : 'N/A'}</p>
                    <p className="text-sm text-gray-700">Scheduled: {new Date(session.scheduledTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-700">Status: {session.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
