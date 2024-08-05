import React from 'react';

function Checkout() {
  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      <p>Complete your purchase here.</p>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" required />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" required />
        </div>
        <div className="mb-3">
          <label htmlFor="creditCard" className="form-label">Credit Card</label>
          <input type="text" className="form-control" id="creditCard" required />
        </div>
        <button type="submit" className="btn btn-primary">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;



