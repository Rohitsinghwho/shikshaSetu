import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/contextProvider.js';
import { useBook } from '../contexts/bookingProvider.js';

export default function Booking({ show, onClose, tutor }) {
  const { isAuthenticated, user } = useAuth();
  const { addBooking } = useBook();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState(''); 

  const [message, setMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!show) {
    return null;
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setShowFeedbackModal(false);

    if (!selectedDate || !selectedTime || !subject) { 
      setMessage('Please fill in all required fields (Date, Time, Subject).');
      setIsSuccess(false);
      setShowFeedbackModal(true);
      return;
    }

    if (!isAuthenticated || !user || !user.id) {
      setMessage('You must be logged in to book a session.');
      setIsSuccess(false);
      setShowFeedbackModal(true);
      return;
    }

    let scheduledTime;
    try {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`; 
      const dateObject = new Date(dateTimeString);

      if (isNaN(dateObject.getTime())) {
        throw new Error("Invalid date or time provided.");
      }
      scheduledTime = dateObject.toISOString();

    } catch (error) {
      console.error("Error formatting scheduled time:", error);
      setMessage('Failed to format scheduled time. Please ensure date and time are valid.');
      setIsSuccess(false);
      setShowFeedbackModal(true);
      return;
    }

    const bookingData = {
      tutor: tutor._id, 
      subject: subject,
      scheduledTime: scheduledTime,
    };

    console.log("Attempting to book session with payload:", bookingData);

    try {
      const response = await axios.post('/api/sessions/', bookingData);

      console.log('Session booking successful:', response.data);
      setMessage('Session booked successfully! The tutor will be notified.');
      setIsSuccess(true);
      
      const newSessionFromBackend = response.data;

      addBooking({
        _id: newSessionFromBackend._id,
        tutor: newSessionFromBackend.tutor,
        student: newSessionFromBackend.student,
        subject: newSessionFromBackend.subject,
        scheduledTime: newSessionFromBackend.scheduledTime,
        status: newSessionFromBackend.status || 'Pending',
        tutorName: tutor.name,
        studentName: user.name,
      });
      
      setSelectedDate('');
      setSelectedTime('');
      setSubject('');
      setDescription(''); 
      onClose();

    } catch (error) {
      console.error('Session booking failed:', error.response ? error.response.data : error.message);
      setMessage(`Failed to book session: ${error.response?.data?.message || error.message}.`);
      setIsSuccess(false);
    } finally {
      setShowFeedbackModal(true); 
    }
  };

  const closeFeedbackModal = () => setShowFeedbackModal(false);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold rounded-full p-1 leading-none"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Book a Session with <span className="text-indigo-600">{tutor.name}</span>
        </h2>

        <form onSubmit={handleSubmitBooking} className="space-y-4">
          <div>
            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="bookingDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              id="bookingTime"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Algebra, Python Basics"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Briefly describe what you need help with (This will not be sent to the backend in the current payload)."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 transform hover:scale-105"
          >
            Confirm Booking
          </button>
        </form>

        {showFeedbackModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
              <h3 className={`text-xl font-semibold mb-4 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {isSuccess ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-700 mb-6">{message}</p>
              <button
                onClick={closeFeedbackModal}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
