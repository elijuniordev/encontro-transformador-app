// src/hooks/useAuthManagement.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthManagement = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userDiscipulado = localStorage.getItem("userDiscipulado");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userDiscipulado");
    navigate("/");
  };

  return {
    userRole,
    userEmail,
    userDiscipulado,
    isAuthenticated,
    handleLogout,
  };
};