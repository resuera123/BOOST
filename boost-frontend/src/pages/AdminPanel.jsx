import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Pending'); // Pending, Approved, Rejected, All

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Check if user is admin
      if (userData.role !== 'ADMIN' && userData.role !== 'admin') {
        alert('Access denied. Admins only.');
        navigate('/home');
        return;
      }
    } else {
      navigate('/login');
      return;
    }
    
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/seller-applications/getAllApplications');
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId, userId) => {
    if (!window.confirm('Approve this seller application?')) return;

    try {
      const response = await fetch(`http://localhost:8080/seller-applications/approve/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to approve application');

      alert('Application approved! User is now a seller.');
      fetchApplications(); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to approve application');
      console.error('Error:', err);
    }
  };

  const handleReject = async (applicationId) => {
    if (!window.confirm('Reject this seller application?')) return;

    try {
      const response = await fetch(`http://localhost:8080/seller-applications/reject/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to reject application');

      alert('Application rejected.');
      fetchApplications(); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to reject application');
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'All') return true;
    return app.applicationStatus === filter;
  });

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-lightning-charge-fill"></i> BOOSTS
          </div>
          <nav className="header-nav">
            <span className="user-greeting">
              👤 {user?.firstname || 'Admin'}
              <span className="admin-badge">⚡ ADMIN</span>
            </span>
            <button className="nav-btn" onClick={() => navigate('/home')}>
              Home
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout&nbsp;&nbsp;<i className="bi bi-box-arrow-right"></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="admin-content">
        <div className="panel-header">
          <h1>Admin Panel - Seller Applications</h1>
          <p className="subtitle">Review and manage seller applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={filter === 'Pending' ? 'tab active' : 'tab'}
            onClick={() => setFilter('Pending')}
          >
            Pending ({applications.filter(a => a.applicationStatus === 'Pending').length})
          </button>
          <button 
            className={filter === 'Approved' ? 'tab active' : 'tab'}
            onClick={() => setFilter('Approved')}
          >
            Approved ({applications.filter(a => a.applicationStatus === 'Approved').length})
          </button>
          <button 
            className={filter === 'Rejected' ? 'tab active' : 'tab'}
            onClick={() => setFilter('Rejected')}
          >
            Rejected ({applications.filter(a => a.applicationStatus === 'Rejected').length})
          </button>
          <button 
            className={filter === 'All' ? 'tab active' : 'tab'}
            onClick={() => setFilter('All')}
          >
            All ({applications.length})
          </button>
        </div>

        {/* Applications List */}
        {error && <div className="error-message">{error}</div>}

        <div className="applications-container">
          {filteredApplications.length === 0 ? (
            <div className="no-applications">
              <p>No {filter.toLowerCase()} applications found.</p>
            </div>
          ) : (
            <div className="applications-grid">
              {filteredApplications.map(app => (
                <div key={app.applicationID} className={`application-card ${app.applicationStatus?.toLowerCase() || 'pending'}`}>
                  <div className="card-header">
                    <div className="applicant-info">
                      <h3>{app.user?.firstname || 'Unknown'} {app.user?.lastname || 'User'}</h3>
                      <p className="email">{app.user?.email || 'No email'}</p>
                      <p className="phone">{app.user?.phone || 'No phone'}</p>
                    </div>
                    <span className={`status-badge ${app.applicationStatus?.toLowerCase() || 'pending'}`}>
                      {app.applicationStatus || 'Pending'}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Application ID:</span>
                      <span className="value">#{app.applicationID}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">User ID:</span>
                      <span className="value">#{app.user?.userID || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Submitted:</span>
                      <span className="value">
                        {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Current Role:</span>
                      <span className="value">{app.user?.role || 'user'}</span>
                    </div>
                  </div>

                  {(app.applicationStatus === 'Pending' || !app.applicationStatus) && (
                    <div className="card-actions">
                      <button 
                        className="btn-approve"
                        onClick={() => handleApprove(app.applicationID, app.user?.userID)}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleReject(app.applicationID)}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}