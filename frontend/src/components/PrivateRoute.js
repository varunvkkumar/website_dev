// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    console.log('PrivateRoute - user:', user);

    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;