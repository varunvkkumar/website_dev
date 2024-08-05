import React from 'react';
import { Link } from 'react-router-dom';

function Sales() {
  return (
    <div className="container section">
      <h1 className="section-heading">Sales</h1>
      <p>Interested in our software? Book a demo to see how it can optimize your mining operations:</p>
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
          <label>Company:</label>
          <input type="text" className="form-control" name="company" />
        </div>
        <div className="form-group">
          <label>Preferred Date:</label>
          <input type="date" className="form-control" name="date" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <p>Contact us at: <a href="mailto:sales@nuevotechsoft.com">sales@nuevotechsoft.com</a></p>
      <Link className="btn btn-secondary mt-4" to="/team">Meet the Team</Link>
    </div>
  );
}

export default Sales;








