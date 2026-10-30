import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("nsv_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("nsv_token"));
  });

  function login(token, userData = null) {
    if (token) {
      localStorage.setItem("nsv_token", token);
    }
    if (userData) {
      localStorage.setItem("nsv_user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("nsv_token");
    localStorage.removeItem("nsv_user");
    setUser(null);
    setIsAuthenticated(false);
  }

  function hasRole(allowedRoles) {
    if (!user || !user.role) return false;
    if (typeof allowedRoles === "string") return user.role === allowedRoles;
    return allowedRoles.includes(user.role);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
