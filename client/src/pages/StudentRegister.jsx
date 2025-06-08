import { useState } from "react";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjects:"",
    educationLevel: "",
  });
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    const data={
      ...formData,
      role:'student'
    }

    try {
      const response = await axios.post('/api/auth/register', data);
      // console.log('Registration successful:', response.data);
      if(response.data.user==200){
        alert('Registration successful')
        navigate('/auth')
      }
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          Join as a Student
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="educationLevel" className="block mb-1 font-medium">Grade / Education Level</label>
            <input
              type="text"
              id="educationLevel"
              name="educationLevel" 
              value={formData.educationLevel} 
              onChange={handleChange} 
              placeholder="e.g. 10th Grade / Undergraduate"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register as Student
          </button>
        </form>
      </div>
    </div>
  );
}