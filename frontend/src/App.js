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
import HealthCalculator from './components/HealthCalculator'; // Import HealthCalculator component
import './App.css';

function App() {
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');
    const userEmail = 'user@example.com';

    // Function to load the container.js script dynamically
    const loadContainerScript = () => {
        const script = document.createElement('script');
        script.src = '/container.js';
        script.async = true;
        script.onload = () => console.log('container.js loaded successfully');
        script.onerror = () => console.error('Failed to load container.js');
        document.head.appendChild(script);
    };

    // Function to push events to the dataLayer
    const pushToDataLayer = (event) => {
        const eventDetail = { event, timestamp: new Date().toISOString(), userEmail };
        if (!window.dataLayer) {
            window.dataLayer = [];
        }
        window.dataLayer.push(eventDetail);
        console.log('Pushed to dataLayer:', eventDetail);
        const customEvent = new CustomEvent('dataLayerPush', { detail: eventDetail });
        window.dispatchEvent(customEvent);
    };

    // Show the coupon modal with a custom message
    const handleShowCoupon = (message) => {
        setCouponMessage(message);
        setShowCoupon(true);
    };

    useEffect(() => {
        loadContainerScript();
        window.showCouponModal = handleShowCoupon;
        pushToDataLayer('page_view');
        return () => {
            window.showCouponModal = null;
        };
    }, []);

    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/" onClick={() => pushToDataLayer('home_link_click')}>
                        Innovative E-Commerce Solutions
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/men" onClick={() => pushToDataLayer('men_link_click')}>
                                    Men
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/women" onClick={() => pushToDataLayer('women_link_click')}>
                                    Women
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/cart" onClick={() => pushToDataLayer('cart_link_click')}>
                                    Cart
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/checkout" onClick={() => pushToDataLayer('checkout_link_click')}>
                                    Checkout
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/pacman" onClick={() => pushToDataLayer('pacman_link_click')}>
                                    Pac-Man
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/arkanoid" onClick={() => pushToDataLayer('arkanoid_link_click')}>
                                    Arkanoid
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/game" onClick={() => pushToDataLayer('game_link_click')}>
                                    Fighting Game
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
                        <Route path="/" element={<Home />} />
                        <Route path="/men" element={<Men />} />
                        <Route path="/women" element={<Women />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/pacman" element={<PacMan />} />
                        <Route path="/arkanoid" element={<Arkanoid />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/health-calculator" element={<HealthCalculator />} /> {/* Add HealthCalculator route */}
                    </Routes>
                </div>
                <CouponModal show={showCoupon} onClose={() => setShowCoupon(false)} message={couponMessage} />
            </div>
        </Router>
    );
}

export default App;


