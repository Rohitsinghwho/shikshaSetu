import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function TutorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjects: "",     
    availability: "",  
    languages: ""      
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowModal(false);

   
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'tutor', 
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
      availability: formData.availability.split(',').map(a => a.trim()).filter(a => a),
      languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
    };

    // console.log("Attempting to register tutor with data:", dataToSend);

    try {
      
      const response = await axios.post('/api/auth/register', dataToSend);
      console.log('Registration successful:', response.data);
      setMessage('Tutor account created successfully!');
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        subjects: "",
        availability: "",
        languages: ""
      });
      setTimeout(() => {
        console.log("navigating")
        navigate('/auth');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setMessage(`Registration failed: ${error.response?.data?.message || error.message}. Please try again.`);
      setIsSuccess(false);
    } finally {
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
          Join as a Tutor
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subjects */}
          <div>
            <label htmlFor="subjects" className="block mb-1 font-medium text-gray-700">Subjects you teach (comma-separated)</label>
            <input
              type="text"
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              placeholder="e.g., Math, Physics, English Literature"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block mb-1 font-medium text-gray-700">Your Availability (comma-separated time slots)</label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g., Mon 9-11 AM, Wed 2-4 PM, Weekends"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Languages */}
          <div>
            <label htmlFor="languages" className="block mb-1 font-medium text-gray-700">Languages you speak (comma-separated)</label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="e.g., English, Hindi, Spanish"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Register as Tutor
          </button>
        </form>

        {/* Modal for messages */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
              <h3 className={`text-xl font-semibold mb-4 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {isSuccess ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-700 mb-6">{message}</p>
              <button
                onClick={closeModal}
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
