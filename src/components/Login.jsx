import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaHeart } from 'react-icons/fa';
import './Login.css';

const Login = ({ onLogin, showToast }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp && !formData.name) {
      newErrors.name = 'Name is required';
    } else if (isSignUp && formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate API call
    const userData = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      avatar: (formData.name || formData.email[0]).charAt(0).toUpperCase()
    };

    onLogin(userData);
    showToast(isSignUp ? 'Account created successfully!' : 'Login successful!');
  };

  return (
    <div className="login-container">
      <h2>CollabCode - Collaborative Coding Platform</h2>
      
      <div className={`login-card ${isSignUp ? 'signup-mode' : ''}`}>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
            
            {isSignUp && (
              <div className="form-group">
                <div className="input-icon">
                  <FaUser />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                </div>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <div className="input-icon">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon">
                <FaLock />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isSignUp && (
              <a href="#" className="forgot-link">Forgot your password?</a>
            )}

            <button type="submit" className="btn btn-primary btn-lg">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button 
                className="btn btn-outline"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your coding journey with us</p>
              <button 
                className="btn btn-outline"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="login-footer">
        <p>
          Created with <FaHeart className="heart-icon" /> by
          <a target="_blank" href="#"> KYA Team</a>
        </p>
      </div>
    </div>
  );
};

export default Login;