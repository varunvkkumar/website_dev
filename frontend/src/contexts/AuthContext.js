// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api'; // Use your configured Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        return localStorage.getItem('tokens') || null;
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setTokens = (token) => {
        localStorage.setItem('tokens', token);
        setAuthTokens(token);
    };

    const register = async (email, password) => {
        try {
            console.log('Registering user:', email);
            const response = await axios.post('/api/auth/register', { email, password });
            console.log('Registration response:', response.data);
            setTokens(response.data.token);
            return { success: true };
        } catch (error) {
            console.error('Registration Error:', error.response?.data?.error || error.message);
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            setTokens(response.data.token);
            return { success: true };
        } catch (error) {
            console.error('Login Error:', error.response?.data?.error || error.message);
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const logout = () => {
        console.log("Logging out...");
        localStorage.removeItem('tokens');
        setAuthTokens(null);
        setUser(null);
    };

    // Validate token on component mount
    useEffect(() => {
        const validateToken = async () => {
            const token = authTokens;
            if (token) {
                try {
                    const response = await axios.post('/api/auth/validate-token', { token });
                    if (response.data.valid) {
                        setUser(response.data.decoded); // Assuming the decoded token has user info
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        validateToken();
    }, [authTokens]);

    return (
        <AuthContext.Provider
            value={{
                authTokens,
                setAuthTokens: setTokens,
                user,
                setUser,
                register,
                login,
                logout,
                loading,
            }}
        >
            {loading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};