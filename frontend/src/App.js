import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Men from './components/Men';
import Women from './components/Women';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CouponModal from './components/CouponModal';
import PacMan from './components/PacMan'; // Import the PacMan component
import './App.css';
import trackEvent from './services/tracking';
import Arkanoid from './components/Arkanoid'; // Import the Arkanoid component


function App() {
  const [clickCount, setClickCount] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const userEmail = 'user@example.com';

  useEffect(() => {
    const handleClick = async (event) => {
      const response = await trackEvent(event, userEmail);
      setClickCount(response.clickCount);

      if (response.clickCount > 0 && response.clickCount % 5 === 0) {
        setShowCoupon(true);
      }
    };

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
          <Link className="navbar-brand" to="/">Innovative E-Commerce Solutions</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/men">Men</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/women">Women</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/checkout">Checkout</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pacman">Pac-Man</Link> {/* Add link to Pac-Man */}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/arkanoid">Arkanoid</Link> {/* Add link to Arkanoid */}
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
            <Route path="/pacman" element={<PacMan />} /> {/* Add route for Pac-Man */}
            <Route path="/arkanoid" element={<Arkanoid />} /> {/* Add route for Arkanoid */}
          </Routes>
        </div>
        <CouponModal show={showCoupon} onClose={closeCoupon} />
      </div>
    </Router>
  );
}

export default App;



















