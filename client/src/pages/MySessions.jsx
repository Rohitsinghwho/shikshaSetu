import React from 'react';
import { useAuth } from '../contexts/contextProvider.js'; 
import { useBook } from '../contexts/bookingProvider.js';

export default function MySessions() {
  const { bookings, loadingBookings, bookingsError } = useBook();
  const { user, loading: authLoading } = useAuth(); 

  if (loadingBookings || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading your sessions...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          My Sessions
        </h1>
        
        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You haven't booked or accepted any sessions yet.
          </p>
        ) : (
          <div className="space-y-6">
            {bookings.map((session) => {
              const isCurrentUserStudent = user && session.student && session.student._id === user.uid;
              const isCurrentUserTutor = user && session.tutor && session.tutor._id === user.uid;

              let otherPartyName = 'N/A';
              let roleInSession = 'Participant';

              if (isCurrentUserStudent && session.tutor) {
                otherPartyName = session.tutor.name || session.tutor.email || 'Unknown Tutor';
                roleInSession = 'Student';
              } else if (isCurrentUserTutor && session.student) {
                otherPartyName = session.student.name || session.student.email || 'Unknown Student';
                roleInSession = 'Tutor';
              }

              return (
                <div key={session._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{session.subject}</h2>
                    {/* Display session status with appropriate styling */}
                    <span className={`font-bold px-3 py-1 rounded-full text-sm 
                      ${session.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${session.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                      ${session.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {session.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Role:</span> {roleInSession}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">{isCurrentUserStudent ? 'Tutor' : 'Student'}:</span> {otherPartyName}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Scheduled Time:</span> {new Date(session.scheduledTime).toLocaleString()}
                  </p>
                  {/* Assuming 'description' is part of your session model in DB. If not, remove or handle. */}
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Description:</span> {session.description || 'N/A'}
                  </p>

                  {/* Optional: Feedback and Rating display, if available in session object */}
                  {session.feedback && (
                    <p className="text-gray-700 mt-2"><span className="font-semibold">Feedback:</span> {session.feedback}</p>
                  )}
                  {session.rating && (
                    <p className="text-yellow-500 mt-1"><span className="font-semibold text-gray-700">Rating:</span> {'⭐'.repeat(session.rating)} {session.rating}/5</p>
                  )}

                  {/* Action Buttons based on status and user role */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                    {/* Example actions for a tutor */}
                    {isCurrentUserTutor && session.status === 'Pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">Accept</button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Reject</button>
                      </>
                    )}
                    {/* Example actions for a student */}
                    {isCurrentUserStudent && session.status === 'Accepted' && (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Join Session</button>
                    )}
                    {/* You can add more buttons here for other statuses like 'Completed' for reviews, etc. */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
