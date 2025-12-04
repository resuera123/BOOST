import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSellerApplication } from '../services/sellerApplicationApi';
import './SellerApplicationPage.css';

export default function SellerApplicationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to apply');
      return;
    }

    // Check if already a seller
    if (user.role === 'SELLER') {
      setError('You are already a seller!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const applicationData = {
        applicationStatus: 'Pending',
        applicationDate: new Date().toISOString().split('T')[0],
        userID: user.userID
      };

      console.log('Submitting application data:', applicationData);
      
      // Submit application - will stay PENDING until admin approves
      const response = await createSellerApplication(applicationData);
      console.log('Application response:', response);
      
      setSuccess(true);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="application-container">
        <p>Please log in to apply as a seller.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (user.role === 'SELLER') {
    return (
      <div className="home-page">
        <header className="home-header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/home')}>
              <i className="bi bi-lightning-charge-fill"></i> BOOSTS
            </div>
            <nav className="header-nav">
              <span className="user-greeting">
                <i class="bi bi-person-fill"></i> Welcome, {user?.firstname || 'Student'}
                <span className="seller-badge"><i class="bi bi-check2"></i> Seller</span>
              </span>
              <button className="nav-btn" onClick={() => navigate('/products')}>
                My Products
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout&nbsp;&nbsp;<i className="bi bi-box-arrow-right"></i>
              </button>
            </nav>
          </div>
        </header>
        <div className="application-container">
          <div className="application-card">
            <h2>You're Already a Seller! 🎉</h2>
            <p>You can now add and manage products.</p>
            <button onClick={() => navigate('/products')} className="btn-submit">
              Go to My Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')}>
            <i className="bi bi-lightning-charge-fill"></i> BOOSTS
          </div>
          <nav className="header-nav">
            <span className="user-greeting">
              <i class="bi bi-person-fill"></i> Welcome, {user?.firstname || 'Student'}
              {user?.role === 'SELLER' && (
                <span className="seller-badge"><i class="bi bi-person-fill"></i> Seller</span>
              )}
            </span>
            {user?.role === 'SELLER' ? (
              <button className="nav-btn" onClick={() => navigate('/products')}>
                My Products
              </button>
            ) : (
              <button className="nav-btn" onClick={() => navigate('/home')}>
                Home
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout&nbsp;&nbsp;<i className="bi bi-box-arrow-right"></i>
            </button>
          </nav>
        </div>
      </header>

      <div className="application-container">
        <div className="application-card">
          <div className="aboveh2"></div>
          <h2>Apply to Become a Seller</h2>
          <div className="belowh2"></div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              ✅ Application submitted successfully! An admin will review your application soon. Redirecting to home...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="application-form">
              <div className="info-section">
                <h3>Your Information</h3>
                <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>

              <div className="terms-section">
                <h3>Seller Requirements</h3>
                <ul>
                  <li>Provide accurate product descriptions</li>
                  <li>Respond to buyer inquiries within 24 hours</li>
                  <li>Maintain a rating above 4.0</li>
                </ul>
              </div>

              <button 
                type="submit" 
                className="btn-submit-application"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}