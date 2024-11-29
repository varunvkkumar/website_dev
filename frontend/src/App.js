import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Men from './components/Men';
import Women from './components/Women';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CouponModal from './components/CouponModal';
import PacMan from './components/PacMan';
import Arkanoid from './components/Arkanoid';
import Game from './components/Game';
import HealthCalculator from './components/HealthCalculator';
import Demo from './components/Demo';
import EcommerceDemo from './components/EcommerceDemo';
import GamesDemo from './components/GamesDemo';
import HomePage from './components/HomePage';
import './App.css';

function App() {
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');
    const userEmail = 'user@example.com';

    const loadContainerScript = () => {
        const script = document.createElement('script');
        script.src = '/container.js';
        script.async = true;
        script.onload = () => console.log('container.js loaded successfully');
        script.onerror = () => console.error('Failed to load container.js');
        document.head.appendChild(script);
    };

    const pushToDataLayer = (event) => {
        const eventDetail = { event, timestamp: new Date().toISOString(), userEmail };
        if (!window.dataLayer) {
            window.dataLayer = [];
        }
        window.dataLayer.push(eventDetail);
    };

    useEffect(() => {
        loadContainerScript();
    }, []);

    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/" onClick={() => pushToDataLayer('home_link_click')}>
                        Shoonya AI
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/demo" onClick={() => pushToDataLayer('demo_link_click')}>
                                    Demo
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/health-calculator" onClick={() => pushToDataLayer('health_calculator_link_click')}>
                                    Health Calculator
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/demo/ecommerce" element={<EcommerceDemo />}>
                            <Route path="home" element={<Home />} />
                            <Route path="men" element={<Men />} />
                            <Route path="women" element={<Women />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="checkout" element={<Checkout />} />
                        </Route>
                        <Route path="/demo/games" element={<GamesDemo />}>
                            <Route path="pacman" element={<PacMan />} />
                            <Route path="arkanoid" element={<Arkanoid />} />
                            <Route path="game" element={<Game />} />
                        </Route>
                        <Route path="/health-calculator" element={<HealthCalculator />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;