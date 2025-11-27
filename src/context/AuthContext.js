import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            token: storedToken
          });
          console.log("✅ User session restored:", userData);
        }
      } catch (error) {
        console.error("Error parsing stored user session:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  // Login function for Microsoft authentication
  const login = (userData, token) => {
    try {
      // Store user data and token
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      
      // Update state
      setUser({
        ...userData,
        token: token
      });
      
      console.log("✅ Login successful, user session saved:", userData);
      return userData;
    } catch (error) {
      console.error("❌ Login failed in AuthContext:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    console.log("✅ User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};