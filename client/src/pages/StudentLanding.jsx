import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Booking from '../components/Booking.jsx'; // Confirmed path for BookingModal
import { useAuth } from '../contexts/contextProvider'; // Confirmed path for AuthContext (as contextProvider)
import { useBook } from '../contexts/bookingProvider.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';

export default function StudentLanding() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [allSubjects, setAllSubjects] = useState([]); 
  
  const navigate = useNavigate();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState(null); 

  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const { getBookingStatusForTutor, getBookingStatusforStudent, loadingBookings, bookingsError } = useBook();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('/api/tutor/match/tutor'); 
        const fetchedTutors = response.data;
        // console.log("Fetched Tutors:", fetchedTutors); 
        setTutors(fetchedTutors);

        const subjectsSet = new Set();
        fetchedTutors.forEach(tutor => {
          if (tutor.subjects && Array.isArray(tutor.subjects)) {
            tutor.subjects.forEach(subject => subjectsSet.add(subject));
          }
        });
        setAllSubjects(Array.from(subjectsSet).sort());

      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Failed to load tutors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []); 

  const handleBookSessionClick = (tutor) => {
    if (!isAuthenticated) {
      alert("Please log in to book a session.");
      navigate('/auth');
      return;
    }

    setSelectedTutorForBooking(tutor); 
    setShowBookingModal(true);        
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);       
    setSelectedTutorForBooking(null); 
  };
  
  const filteredTutors = selectedSubject
    ? tutors.filter(tutor =>
        tutor.subjects && Array.isArray(tutor.subjects) && tutor.subjects.includes(selectedSubject)
      )
    : tutors;
    //   console.log(filteredTutors)
  if (loading || authLoading || loadingBookings) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading tutors and your bookings...</p>
      </div>
    );
  }

  if (error || bookingsError) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 text-lg p-6">
        <p>{error || bookingsError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* <Header/> */}
      <div className="container mx-auto mt-5">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Find Your Perfect Tutor
        </h1>

        <div className="mb-8 flex justify-center">
          <label htmlFor="subject-filter" className="sr-only">Filter by Subject</label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          >
            <option value="">All Subjects</option>
            {allSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {filteredTutors.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No tutors found for the selected criteria.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map((tutor) => {

              const bookingStatus = isAuthenticated && user ? getBookingStatusForTutor(tutor._id) : null;
              let buttonText = "Book Session";
              let buttonClasses = "bg-green-600 hover:bg-green-700";
              let buttonDisabled = false;

              if (!isAuthenticated) {
                buttonText = "Log in to Book";
                buttonClasses = "bg-gray-400 cursor-not-allowed";
                buttonDisabled = false;
              } else if (bookingStatus === 'Pending') { 
                buttonText = "Session Pending";
                buttonClasses = "bg-yellow-500 cursor-not-allowed";
                buttonDisabled = true;
              } else if (bookingStatus === 'Accepted') { 
                buttonText = "Session Accepted";
                buttonClasses = "bg-blue-500 cursor-not-allowed";
                buttonDisabled = true;
              } else if (bookingStatus === 'Rejected') { 
                buttonText = "Session Rejected";
                buttonClasses = "bg-red-500 hover:bg-red-600";
                buttonDisabled = false; 
              }

              return (
                <div key={tutor._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{tutor.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{tutor.email}</p>

                    {tutor.subjects && tutor.subjects.length > 0 && (
                      <div className="mb-3">
                        <p className="font-semibold text-gray-700">Subjects:</p>
                        <ul className="list-none flex flex-wrap gap-2 mt-1">
                          {tutor.subjects.map((subject, index) => (
                            <li key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {subject}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tutor.availability && tutor.availability.length > 0 && (
                      <div className="mb-3">
                        <p className="font-semibold text-gray-700">Availability:</p>
                        <ul className="list-none text-sm text-gray-600 space-y-1 mt-1">
                          {tutor.availability.map((slot, index) => (
                            <li key={index}>{slot}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tutor.languages && tutor.languages.length > 0 && (
                      <div className="mb-3">
                        <p className="font-semibold text-gray-700">Languages:</p>
                        <ul className="list-none flex flex-wrap gap-2 mt-1">
                          {tutor.languages.map((lang, index) => (
                            <li key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {lang}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-700 text-sm mb-2">
                      <span className="font-semibold mr-2">Rating:</span>
                      <span className="text-yellow-500 text-lg">
                        {'⭐'.repeat(Math.round(tutor.rating))}
                        {tutor.rating.toFixed(1)} / 5
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <span className="font-semibold mr-2">Sessions Completed:</span>
                      <span className="text-blue-600">{tutor.sessionsCompleted}</span>
                    </div>
                  </div>

                  <button
                    className={`mt-4 w-full text-white py-2 rounded-lg transition duration-300 transform hover:scale-105 ${buttonClasses} ${buttonDisabled ? 'opacity-70' : ''}`}
                    onClick={() => handleBookSessionClick(tutor)}
                    disabled={buttonDisabled && isAuthenticated}
                  >
                    {buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTutorForBooking && ( 
        <Booking
          show={showBookingModal}           
          onClose={handleCloseBookingModal} 
          tutor={selectedTutorForBooking}   
        />
      )}
    </div>
  );
}
