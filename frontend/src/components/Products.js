import React from 'react';
import { Link } from 'react-router-dom';

function Products() {
  return (
    <div className="container section">
      <h1 className="section-heading">Products</h1>
      <h2>MineOpt</h2>
      <p>MineOpt is a comprehensive mine planning software designed to optimize mining operations. It includes features such as:</p>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Resource estimation</li>
        <li className="list-group-item">Mine design</li>
        <li className="list-group-item">Production scheduling</li>
        <li className="list-group-item">Cost analysis</li>
      </ul>
      <h2 className="mt-4">Future Products</h2>
      <p>We have several exciting products in the pipeline to enhance mining efficiency and productivity. Stay tuned for more updates!</p>
      <Link className="btn btn-primary mt-4" to="/support">Get Support</Link>
    </div>
  );
}

export default Products;







