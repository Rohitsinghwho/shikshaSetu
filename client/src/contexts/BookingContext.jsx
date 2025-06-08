import React, { createContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from './contextProvider.js';

const BookingContext = createContext(null);


export const BookingProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
        // console.log("inside")
        if (!authLoading && isAuthenticated && user && user?.id) {
        setLoadingBookings(true);
        setBookingsError(null);
        try {
          const response = await axios.get(`/api/sessions/getUserSession`);
        //   console.log("calling")
        console.log("sessions response: ",response)
          
          setBookings(response.data);
        } catch (error) {
          setBookingsError("Failed to load your bookings.");
        } finally {
          setLoadingBookings(false);
        }
      } else if (!authLoading && !isAuthenticated) {
        setBookings([]);
        setLoadingBookings(false);
      }
}

    fetchUserBookings();
  }, [isAuthenticated, user, authLoading]);

  const addBooking = (newBooking) => {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prevBookings) =>
      prevBookings?.map((booking) =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const getBookingStatusforStudent=()=>{
    const loggedIn=user?.id;
    const booking = bookings?.find((loggedIn) =>
       (b)=>{    
        return b.student._id==loggedIn
       }
    );
    return booking?.status;

  }
  const getBookingStatusForTutor = (tutorId) => {
    // console.log(tutorId)
    // console.log(bookings)
    const booking = bookings?.find(
      (b) => b.tutor._id === tutorId
    );
    // console.log(booking)
    if (booking) {
      return booking.status;
    }
    return null;
  };

  const bookingContextValue = {
    bookings,
    loadingBookings,
    bookingsError,
    addBooking,
    updateBookingStatus,
    getBookingStatusForTutor,
    getBookingStatusforStudent
  };

  if (authLoading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading bookings...</p>
      </div>
    );
  }

  return (
    <BookingContext.Provider value={bookingContextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
