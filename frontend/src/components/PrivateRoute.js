// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { authTokens, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner/loading indicator
    }

    console.log('PrivateRoute - authTokens:', authTokens);

    return authTokens ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;