// src/components/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Create UserContext
export const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      // Save user and userId to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      if (user.id) {
        localStorage.setItem("userId", user.id);
      }
    } else {
      // Remove user and userId from localStorage when logging out
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
