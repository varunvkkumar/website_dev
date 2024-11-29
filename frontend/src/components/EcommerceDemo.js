// components/EcommerceDemo.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const EcommerceDemo = () => {
    return (
        <div>
            <h1>Ecommerce Demo Page</h1>
            <ul>
                <li><Link to="home">Home</Link></li>
                <li><Link to="men">Men</Link></li>
                <li><Link to="women">Women</Link></li>
                <li><Link to="cart">Cart</Link></li>
                <li><Link to="checkout">Checkout</Link></li>
            </ul>
            <Outlet />
        </div>
    );
};

export default EcommerceDemo;