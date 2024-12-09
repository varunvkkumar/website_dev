// frontend/src/components/Navbar.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { authTokens, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">Shoonya AI</Link>
      {/* ...other navigation items... */}
      {authTokens ? (
        <>
          <Link className="nav-link" to="/health-calculator">Health Calculator</Link>
          <Link className="nav-link" to="/add-feature">Add Feature</Link>
          <Link className="nav-link" to="/add-formula">Add Formula</Link>
          <button className="btn btn-outline-light" onClick={logout}>Logout</button>
        </>
      ) : (
        <Link className="nav-link" to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;