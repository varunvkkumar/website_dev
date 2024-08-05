import React from 'react';
import { Link } from 'react-router-dom';

function Support() {
  return (
    <div className="container section">
      <h1 className="section-heading">Support</h1>
      <p>Welcome to the support area. Here, you can:</p>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Download the latest software versions</li>
        <li className="list-group-item">Log a support ticket</li>
        <li className="list-group-item">Read our blog</li>
        <li className="list-group-item">Watch training videos</li>
      </ul>
      <p>Contact us at: <a href="mailto:support@nuevotechsoft.com">support@nuevotechsoft.com</a></p>
      <Link className="btn btn-primary mt-4" to="/investors">Investor Relations</Link>
    </div>
  );
}

export default Support;







