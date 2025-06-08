import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-4 bg-green-50">
        <h2 className="text-4xl font-bold mb-4">Bridging the Gap in Education</h2>
        <p className="text-lg max-w-xl mb-6">
          Empowering underserved students by connecting them with passionate volunteer tutors.
        </p>
        <div className="space-x-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition" onClick={()=>navigate('/student/register')}>Join as Student</button>
          <button className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg hover:bg-yellow-500 transition" onClick={()=>navigate('/tutor/register')}>Join as Tutor</button>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-semibold text-center mb-10">Why ShikshaSetu?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-4 border rounded shadow-sm">
            <span className="text-4xl">🎓</span>
            <h4 className="text-xl font-semibold mt-2">Free Quality Education</h4>
            <p>Access learning without any cost.</p>
          </div>
          <div className="p-4 border rounded shadow-sm">
            <span className="text-4xl">🤝</span>
            <h4 className="text-xl font-semibold mt-2">Volunteer-Driven</h4>
            <p>Connect with tutors who care.</p>
          </div>
          <div className="p-4 border rounded shadow-sm">
            <span className="text-4xl">🌐</span>
            <h4 className="text-xl font-semibold mt-2">Learn Anywhere</h4>
            <p>Join sessions from any location.</p>
          </div>
          <div className="p-4 border rounded shadow-sm">
            <span className="text-4xl">✅</span>
            <h4 className="text-xl font-semibold mt-2">Safe & Verified</h4>
            <p>All tutors are background-checked.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
