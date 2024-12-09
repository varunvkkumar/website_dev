// src/components/Demo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Demo.css';

function Demo() {
    return (
        <div className="section demo-page">
            <div className="section-header">
                <h1>Explore Our Demos</h1>
                <p>Experience the capabilities of Shoonya AI through our interactive demos.</p>
            </div>
            <div className="demo-content">
                <div className="demo-card">
                    <h2>E-commerce Demo</h2>
                    <p>Discover our AI solutions in the retail sector.</p>
                    <Link to="/demo/ecommerce" className="demo-button">View E-commerce Demo</Link>
                </div>
                <div className="demo-card">
                    <h2>Games Demo</h2>
                    <p>Experience AI-driven gaming innovation.</p>
                    <Link to="/demo/games" className="demo-button">View Games Demo</Link>
                </div>
            </div>
        </div>
    );
}

export default Demo;