// App.js
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
import './App.css';
import trackEvent from './services/tracking'; // Import trackEvent

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const userEmail = 'user@example.com'; // Define userEmail inside the component

  // Modified handleClick function to use trackingId
  const handleClick = async (event) => {
    const trackingId = event.target.getAttribute('data-tracking-id');

    // Only track events with a specific data-tracking-id
    if (!trackingId) return;

    try {
      const response = await trackEvent({ trackingId }, userEmail);
      console.log('Response from server:', response); // Debug log
      if (response.showCoupon) { // Use the server's decision
        console.log('Setting showCoupon to true');  // Additional debug log
        setShowCoupon(true);
      }
    } catch (error) {
      console.error('Error in handleClick:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [userEmail]);

  const closeCoupon = () => {
    setShowCoupon(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className="navbar-brand" to="/" data-tracking-id="home-link">
            Innovative E-Commerce Solutions
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            data-tracking-id="navbar-toggle"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/" data-tracking-id="home-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/men" data-tracking-id="men-link">
                  Men
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/women" data-tracking-id="women-link">
                  Women
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart" data-tracking-id="cart-link">
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/checkout" data-tracking-id="checkout-link">
                  Checkout
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pacman" data-tracking-id="pacman-link">
                  Pac-Man
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/arkanoid" data-tracking-id="arkanoid-link">
                  Arkanoid
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/game" data-tracking-id="game-link">
                  Fighting Game
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
          </Routes>
        </div>
        <CouponModal show={showCoupon} onClose={closeCoupon} />
      </div>
    </Router>
  );
}

export default App;


























