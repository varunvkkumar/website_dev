// src/components/Logout.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Navigate anyway in case of error
        navigate('/');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <p>Logging out...</p>
      </div>
    </div>
  );
}

export default Logout;