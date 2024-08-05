import React from 'react';

function Women() {
  return (
    <div className="container mt-5">
      <h1>Women's Products</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="Women Product 1" />
            <div className="card-body">
              <h5 className="card-title">Women Product 1</h5>
              <p className="card-text">Description of Women Product 1.</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="Women Product 2" />
            <div className="card-body">
              <h5 className="card-title">Women Product 2</h5>
              <p className="card-text">Description of Women Product 2.</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="Women Product 3" />
            <div className="card-body">
              <h5 className="card-title">Women Product 3</h5>
              <p className="card-text">Description of Women Product 3.</p>
              <a href="#" className="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Women;


