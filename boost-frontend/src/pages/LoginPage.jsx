import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser(formData.studentEmail, formData.password);
      // accommodate controller response shape: { success: true, user: {...} }
      const user = result.user || result;
      if (user && user.userID) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="logo">⚡ BOOSTS</div>
            <h1>Welcome Back</h1>
            <p className="subtitle">Login to your student account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="studentEmail">Student Email</label>
              <input
                type="email"
                id="studentEmail"
                name="studentEmail"
                placeholder="your.email@university.edu"
                value={formData.studentEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="register-link">
            Don't have an account? <a href="/register">Register here</a>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <p><span className="demo-label">Student:</span> student@university.edu / password123</p>
            <p><span className="demo-label">Seller:</span> seller@university.edu / password123</p>
            <p><span className="demo-label">Admin:</span> admin@university.edu / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}