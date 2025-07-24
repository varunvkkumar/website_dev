import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { pushToDataLayer } from '../utils/analytics';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log('Form submitted');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            console.log('Calling register function with:', email, password);
            const result = await register(email, password);
            console.log('Register function result:', result);
            if (result.success) {
                pushToDataLayer('signup_success');
                navigate('/health-calculator');
            } else {
                setError(result.error || 'Registration failed');
                pushToDataLayer('signup_failure', { error: result.error });
            }
        } catch (err) {
            setError('Registration failed');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await loginWithGoogle();
            if (result.success) {
                pushToDataLayer('google_signup_success');
                navigate('/health-calculator');
            } else {
                setError(result.error || 'Google sign-up failed');
                pushToDataLayer('google_signup_failure', { error: result.error });
            }
        } catch (error) {
            console.error('Google sign-up error:', error);
            setError('An error occurred during Google sign-up.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: 'white', padding: '20px' }}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Sign Up</h2>
                            <form onSubmit={handleSubmit} className="signup-form">
                                <div className="form-group mb-3">
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
                                <div className="form-group mb-3">
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
                                <div className="form-group mb-3">
                                    <label>Confirm Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {error && <p className="text-danger mt-2">{error}</p>}
                                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                                    {loading ? 'Signing up...' : 'Sign Up'}
                                </button>
                            </form>
                            
                            <div className="mt-3">
                                <hr />
                                <p className="text-center">Or</p>
                                <button 
                                    type="button" 
                                    className="btn btn-danger w-100 mt-2"
                                    onClick={handleGoogleSignUp}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing up...' : 'Sign up with Google'}
                                </button>
                            </div>
                            
                            <p className="text-center mt-3">
                                Already have an account? <Link to="/login">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
