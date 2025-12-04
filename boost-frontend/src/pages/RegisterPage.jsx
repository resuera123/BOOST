import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    middlename: '',
    lastname: '',
    studentEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'middlename') {
      const initial = value.replace(/[^a-zA-Z]/g, '').slice(0, 1).toUpperCase();
      setFormData(prev => ({ ...prev, [name]: initial }));
      return;
    }

    if (name === 'username') {
      // normalize username: lowercase, allow letters/numbers/._-, replace spaces with underscore
      const cleaned = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9._-]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // normalize phone to +63XXXXXXXXX (expects a Philippine mobile number)
  const normalizePhone = (input) => {
    if (!input) return null;
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.startsWith('63')) digits = digits.slice(2);
    // expect 10 digits starting with 9 (9XXXXXXXXX)
    if (digits.length === 10) return '+63' + digits;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentEmail.endsWith('.edu')) {
      setError('Please use a .edu student email');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const normalizedPhone = normalizePhone(formData.phone);
    if (!normalizedPhone) {
      setError('Enter a valid Philippine phone number (example: 9XXXXXXXXX). Country code +63 will be added.');
      return;
    }

    setLoading(true);
    try {
      // fallback username: firstname + middlename initial + lastname if user didn't provide one
      const fallbackUsername = `${formData.firstname}${formData.middlename ? ' ' + formData.middlename + '.' : ''} ${formData.lastname}`.trim().toLowerCase().replace(/\s+/g, '_');
      const userPayload = {
        username: formData.username && formData.username.length ? formData.username : fallbackUsername,
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        email: formData.studentEmail,
        password: formData.password,
        phone: normalizedPhone,
        role: 'STUDENT'
      };

      await registerUser(userPayload);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="logo"><i class="bi bi-lightning-charge-fill"></i> BOOSTS</div>
            <h1>Create Account</h1>
            <p className="subtitle">Join the student marketplace</p>
          </div>

          {error && <div className="error-message" style={{color:'red',marginBottom:12}}>{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                />
              </div>

              <div className="form-group middle-initial">
                <label>M.I</label>
                <input
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  placeholder="M.I"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone (+63)</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Student Email (.edu)</label>
              <input name="studentEmail" type="email" value={formData.studentEmail} onChange={handleChange} placeholder="Student Email" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            </div>

            <button type="submit" className="submit-button-register" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
}