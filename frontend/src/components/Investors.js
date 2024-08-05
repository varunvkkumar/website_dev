import React from 'react';
import { Link } from 'react-router-dom';

function Investors() {
  return (
    <div className="container section">
      <h1 className="section-heading">Investors</h1>
      <p>We welcome investors to learn more about our innovative mining solutions and opportunities to invest in our growing company. You can:</p>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Watch our investor presentation</li>
        <li className="list-group-item">Submit an expression of interest</li>
      </ul>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" className="form-control" name="name" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" name="email" />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea className="form-control" name="message"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <p>Contact us at: <a href="mailto:ranajit@nuevotechsoft.com">ranajit@nuevotechsoft.com</a></p>
      <Link className="btn btn-secondary mt-4" to="/support">Get Support</Link>
    </div>
  );
}

export default Investors;








