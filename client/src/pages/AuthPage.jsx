import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../contexts/contextProvider.js";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {

  const [loginData,setLoginData]=useState({
    name:"",
    email: "",
    password: "",
  })
  const {login}= useAuth();
  const navigate=useNavigate();
  const handleLogin=(e)=>{
    setLoginData({
      ...loginData,
      [e.target.name]:e.target.value

    })
  }
  const dataToSend={
    email:loginData.email,
    password:loginData.password
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const response=await axios.post('/api/auth/login',dataToSend);
      // console.log(response.data.user);
      if(response.data.user){
        const user=response.data.user;
        login(user);
        if(response.data.user.role=="student"){
         
          setTimeout(() => {
            console.log("navigation")
            navigate('/student-dashboard');
          }, 2000);
        }
        else if(response.data.user.role=="tutor"){
          setTimeout(() => {
            navigate('/tutor-dashboard');
          }, 2000);
        
      }
      else{
        console.log("Invalid user role");
      }
    }
  }catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
         Login to ShikshaSetu
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* {!isLogin && ( */}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={loginData.name}
                onChange={handleLogin}
              />
            </div>
          {/* )} */}

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              name="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={loginData.email}
                onChange={handleLogin}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={handleLogin}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        
          >
           Login
          </button>
        </form>
      </div>
    </div>
  );
}
