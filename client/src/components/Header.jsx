import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/contextProvider.js'; // Adjusted path to include .js extension
import axios from 'axios';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    
    navigate('/auth');
  };

  const handleLogoutClick = async() => {
    try {
        const response= await axios.post('/api/auth/logout');
        logout();
        navigate('/'); 
    } catch (error) {
        console.log("unable to logout")
    }
  };

  return (
    <header className="flex justify-between items-center p-6 shadow-md bg-white rounded-b-xl">
      <Link to="/" className="text-3xl font-extrabold text-green-700 font-inter rounded-lg p-2 hover:bg-green-50 transition">
        ShikshaSetu
      </Link>
      <nav className="space-x-4 flex items-center">
        {isAuthenticated ? (
          <>
            <Link 
              to="/get-my-sessions" 
              className="px-5 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition shadow-md"
            >
              My Sessions
            </Link>
            <button
              onClick={handleLogoutClick}
              className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-md"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
