// src/components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { pushToDataLayer } from '../utils/analytics';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        pushToDataLayer('login_success');
        navigate('/health-calculator');
      } else {
        setError(result.error || 'Login failed');
        pushToDataLayer('login_failure', { error: result.error });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        pushToDataLayer('google_login_success');
        navigate('/health-calculator');
      } else {
        setError(result.error || 'Google login failed');
        pushToDataLayer('google_login_failure', { error: result.error });
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('An error occurred during Google login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group mt-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-3">
        <hr />
        <p className="text-center">Or</p>
        <button 
          type="button" 
          className="btn btn-danger mt-2 w-100"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
      
      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;