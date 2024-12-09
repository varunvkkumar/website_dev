// src/components/Logout.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { setAuthTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthTokens(null);
    navigate('/');
  }, [setAuthTokens, navigate]);

  return null;
}

export default Logout;