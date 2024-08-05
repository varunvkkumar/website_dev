import React from 'react';
import { Link } from 'react-router-dom';

function Team() {
  return (
    <div className="container section">
      <h1 className="section-heading">Our Team</h1>
      <p>Meet the dedicated team behind NuevoTech Soft:</p>
      <ul className="list-group list-group-flush">
        <li className="list-group-item"><strong>John Doe</strong> - CEO and Founder</li>
        <li className="list-group-item"><strong>Jane Smith</strong> - Chief Technology Officer</li>
        <li className="list-group-item"><strong>Emily Johnson</strong> - Lead Software Engineer</li>
        <li className="list-group-item"><strong>Michael Brown</strong> - Head of Mining Operations</li>
      </ul>
      <Link className="btn btn-primary mt-4" to="/sales">Contact Sales</Link>
    </div>
  );
}

export default Team;





