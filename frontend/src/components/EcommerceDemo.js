// src/components/EcommerceDemo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './EcommerceDemo.css';

function EcommerceDemo() {
  return (
    <div className="section ecommerce-demo">
      <div className="section-header">
        <h1>E-commerce Demo</h1>
        <p>Explore how Shoonya AI enhances the retail experience.</p>
      </div>
      <div className="demo-content">
        <div className="demo-card">
          <h2>Home</h2>
          <p>Experience our AI-driven e-commerce homepage.</p>
          <Link to="home" className="demo-button">View Home</Link>
        </div>
        <div className="demo-card">
          <h2>Men's Collection</h2>
          <p>Discover AI-curated products for men.</p>
          <Link to="men" className="demo-button">View Men's Collection</Link>
        </div>
        <div className="demo-card">
          <h2>Women's Collection</h2>
          <p>Explore AI-curated products for women.</p>
          <Link to="women" className="demo-button">View Women's Collection</Link>
        </div>
        <div className="demo-card">
          <h2>Shopping Cart</h2>
          <p>See the AI-enhanced shopping cart experience.</p>
          <Link to="cart" className="demo-button">View Cart</Link>
        </div>
        <div className="demo-card">
          <h2>Checkout</h2>
          <p>Experience our AI-optimized checkout process.</p>
          <Link to="checkout" className="demo-button">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}

export default EcommerceDemo;