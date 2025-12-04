import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      {/* Header */}
      <header className="welcome-header">
        <div className="header-content">
          <div className="logo"><i class="bi bi-lightning-charge-fill"></i>BOOSTS</div>
          <nav className="header-nav">
            <button className="login-link-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="get-started-btn" onClick={() => navigate('/register')}>Get Started</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-container">
        <h1>Your Student Marketplace,<br />Powered by Trust</h1>
        <p>Connect with verified student sellers. Buy and sell products safely within your campus community.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Join BOOSTS</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose BOOSTS?</h2>
        <p className="subtitle">A marketplace built specifically for students, by students</p>
        
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon lock">🔒</div>
            <h3>Secure Authentication</h3>
            <p>Safe and secure login system exclusively for students. Your data is protected.</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon shield">🛡️</div>
            <h3>Verified Sellers</h3>
            <p>All sellers go through verification. Check credibility scores before purchasing.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon filter">⚡</div>
            <h3>AI Content Filtering</h3>
            <p>Advanced AI ensures all product listings are appropriate and legitimate.</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon search">📦</div>
            <h3>Easy Product Discovery</h3>
            <p>User-friendly interface with smart search and filters to find exactly what you need.</p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon seller">👥</div>
            <h3>Become a Seller</h3>
            <p>Apply to become a verified seller and start your entrepreneurial journey.</p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <div className="feature-icon hub">📈</div>
            <h3>Centralized Hub</h3>
            <p>All your campus marketplace needs in one convenient platform.</p>
          </div>
        </div>
      </section>
    </div>
  );
}