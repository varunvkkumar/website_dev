import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import Demo from './components/Demo';
import EcommerceDemo from './components/EcommerceDemo';
import GamesDemo from './components/GamesDemo';
import HealthCalculator from './components/HealthCalculator/HealthCalculator';
import AddFeature from './components/AddFeature/AddFeature';
import AddFormula from './components/AddFormula/AddFormula';
import Login from './components/Login';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './components/SignUp';
import './App.css';
import { pushToDataLayer } from './utils/analytics';

function App() {
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/container.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            pushToDataLayer('container_script_loaded');
        };
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <Link className="navbar-brand" to="/">Shoonya AI</Link>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-toggle="collapse" 
                            data-target="#navbarNav"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link to="/demo" className="nav-link">Demo</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav">
                                <AuthButton />
                            </ul>
                        </div>
                    </nav>

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/demo/ecommerce/*" element={<EcommerceDemo />} />
                        <Route path="/demo/games/*" element={<GamesDemo />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route
                            path="/health-calculator"
                            element={
                                <PrivateRoute>
                                    <HealthCalculator />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/add-feature"
                            element={
                                <PrivateRoute>
                                    <AddFeature />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/add-formula"
                            element={
                                <PrivateRoute>
                                    <AddFormula />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

function AuthButton() {
    const { authTokens, logout } = useContext(AuthContext);

    console.log('AuthButton - authTokens:', authTokens);

    return authTokens ? (
        <>
            <li className="nav-item">
                <Link to="/health-calculator" className="nav-link" onClick={() => pushToDataLayer('health_calculator_click')}>
                    Health Calculator
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/logout" className="nav-link" onClick={() => { logout(); pushToDataLayer('logout_click'); }}>
                    Logout
                </Link>
            </li>
        </>
    ) : (
        <>
            <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => pushToDataLayer('login_click')}>
                    Login
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/signup" className="nav-link" onClick={() => pushToDataLayer('signup_click')}>
                    Sign Up
                </Link>
            </li>
        </>
    );
}

export default App;
