// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
// import { signUpWithEmail, signInWithEmail, signInWithGoogle, logout as firebaseLogout, onAuthStateChange } from '../services/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Set to false for mock auth

    // Mock register function (bypasses Firebase)
    const register = async (email, password) => {
        try {
            console.log('Mock registration for:', email);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock successful registration
            const mockUser = {
                uid: `mock-${Date.now()}`,
                email: email,
                displayName: email.split('@')[0],
                accessToken: 'mock-token-' + Date.now()
            };
            
            setUser(mockUser);
            
            // Store token in localStorage for API calls
            localStorage.setItem('authToken', mockUser.accessToken);
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            
            console.log('Mock registration successful:', mockUser);
            return { success: true, user: mockUser };
        } catch (error) {
            console.error('Mock Registration Error:', error.message);
            return { success: false, error: error.message };
        }
    };

    // Mock login function (bypasses Firebase)
    const login = async (email, password) => {
        try {
            console.log('Mock login for:', email);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock successful login
            const mockUser = {
                uid: `mock-${Date.now()}`,
                email: email,
                displayName: email.split('@')[0],
                accessToken: 'mock-token-' + Date.now()
            };
            
            setUser(mockUser);
            
            // Store token in localStorage for API calls
            localStorage.setItem('authToken', mockUser.accessToken);
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            
            console.log('Mock login successful:', mockUser);
            return { success: true, user: mockUser };
        } catch (error) {
            console.error('Mock Login Error:', error.message);
            return { success: false, error: error.message };
        }
    };

    // Mock Google Sign-In function
    const loginWithGoogle = async () => {
        try {
            console.log('Mock Google login');
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock successful Google login
            const mockUser = {
                uid: `mock-google-${Date.now()}`,
                email: 'user@gmail.com',
                displayName: 'Google User',
                accessToken: 'mock-google-token-' + Date.now()
            };
            
            setUser(mockUser);
            
            // Store token in localStorage for API calls
            localStorage.setItem('authToken', mockUser.accessToken);
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            
            console.log('Mock Google login successful:', mockUser);
            return { success: true, user: mockUser };
        } catch (error) {
            console.error('Mock Google Login Error:', error.message);
            return { success: false, error: error.message };
        }
    };

    // Mock logout function
    const logout = async () => {
        try {
            setUser(null);
            
            // Clear tokens from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('mockUser');
            
            console.log("Mock logout successful");
        } catch (error) {
            console.error('Mock logout error:', error);
        }
    };

    // Mock authentication state - no Firebase listener needed
    useEffect(() => {
        // Check if user was previously logged in
        const savedUser = localStorage.getItem('mockUser');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedUser && savedToken) {
            const user = JSON.parse(savedUser);
            // Verify token is still valid (in a real app, you'd check expiration)
            if (user.accessToken === savedToken) {
                setUser(user);
            } else {
                // Token mismatch, clear storage
                localStorage.removeItem('mockUser');
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authTokens: user ? { access: user.accessToken } : null, // For backward compatibility
                setAuthTokens: () => {}, // Deprecated but kept for compatibility
                user,
                setUser,
                register,
                login,
                loginWithGoogle,
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