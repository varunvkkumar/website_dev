import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const heroSectionStyle = {
  backgroundColor: '#282c34', // Use a solid color for now
  color: 'white',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center'
};

const heroContentStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '20px',
  borderRadius: '10px'
};

function Home() {
  return (
    <div style={heroSectionStyle}>
      <div style={heroContentStyle}>
        <h1 className="display-4">Welcome to NuevoTech Soft</h1>
        <p className="lead">Your one-stop shop for all your tech needs</p>
        <Link className="btn btn-primary btn-lg" to="/products">Shop Now</Link>
        <Link className="btn btn-secondary btn-lg" to="/team" style={{ marginLeft: '10px' }}>Meet the Team</Link>
      </div>
      <div className="container mt-5">
        <h2>Featured Products</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <img src="https://via.placeholder.com/150" className="card-img-top" alt="Product 1" />
              <div className="card-body">
                <h5 className="card-title">Product 1</h5>
                <p className="card-text">This is a short description of Product 1.</p>
                <Link to="/products" className="btn btn-primary">View Product</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <img src="https://via.placeholder.com/150" className="card-img-top" alt="Product 2" />
              <div className="card-body">
                <h5 className="card-title">Product 2</h5>
                <p className="card-text">This is a short description of Product 2.</p>
                <Link to="/products" className="btn btn-primary">View Product</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <img src="https://via.placeholder.com/150" className="card-img-top" alt="Product 3" />
              <div className="card-body">
                <h5 className="card-title">Product 3</h5>
                <p className="card-text">This is a short description of Product 3.</p>
                <Link to="/products" className="btn btn-primary">View Product</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;



















