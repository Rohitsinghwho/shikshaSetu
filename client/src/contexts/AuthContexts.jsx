
import React, { createContext, useState, useEffect} from 'react';
const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
       
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false); 
      }
    };

    loadUserFromStorage();
  }, []); 

  const login = (userData) => {
    console.log("login is called")
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log("User logged in:", userData);
  };

  // 5. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log("User logged out.");
  };

  // 6. Provide the context value
  const authContextValue = {
    user,
    loading,
    isAuthenticated: !!user, // Convenience boolean
    login,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading user session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;