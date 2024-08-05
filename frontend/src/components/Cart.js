import React from 'react';

function Cart() {
  return (
    <div className="container mt-5">
      <h1>Your Cart</h1>
      <p>Items you have added to your cart will appear here.</p>
      <ul className="list-group">
        <li className="list-group-item">Product 1 - $10.00</li>
        <li className="list-group-item">Product 2 - $20.00</li>
        <li className="list-group-item">Product 3 - $30.00</li>
      </ul>
      <div className="mt-3">
        <a href="/checkout" className="btn btn-primary">Proceed to Checkout</a>
      </div>
    </div>
  );
}

export default Cart;


