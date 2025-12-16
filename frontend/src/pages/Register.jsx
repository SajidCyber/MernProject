import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Leaf, Building2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authService';
import './Auth.css';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'receiver';
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    role: initialRole 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!agreedTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    setLoading(true);
    try {
      const data = await registerApi(form);
      login(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-gradient"></div>
        <motion.div 
          className="auth-blob blob-1"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="auth-blob blob-2"
          animate={{ scale: [1.1, 1, 1.1], rotate: [45, 0, 45] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="auth-container">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="auth-logo">
            <Leaf size={28} />
            <span>FoodShare</span>
          </Link>

          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join the movement to reduce food waste</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selector */}
            <div className="role-selector">
              <div 
                className={`role-option ${form.role === 'donor' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'donor' })}
              >
                <span className="role-icon"><Building2 size={28} /></span>
                <span className="role-title">Donor</span>
                <span className="role-desc">Share surplus food</span>
              </div>
              <div 
                className={`role-option ${form.role === 'receiver' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'receiver' })}
              >
                <span className="role-icon"><Heart size={28} /></span>
                <span className="role-title">Receiver</span>
                <span className="role-desc">Get food donations</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-icon">
                <User size={20} className="icon" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-icon">
                <Mail size={20} className="icon" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div className="form-input-icon">
                <Phone size={20} className="icon" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-icon">
                <Lock size={20} className="icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="form-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="terms-label">
              <input 
                type="checkbox" 
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
              />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-social">
            <button className="social-btn">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </motion.div>

        <div className="auth-visual">
          <motion.div
            className="auth-visual-content"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="visual-badge">
              <span>🤝</span>
              Join Our Community
            </div>
            <h2>Start making an impact today</h2>
            <p>Whether you're sharing surplus food or receiving donations, every action counts toward a zero-waste future.</p>
            
            <div className="visual-stats">
              <div className="visual-stat">
                <strong>500+</strong>
                <span>NGO Partners</span>
              </div>
              <div className="visual-stat">
                <strong>100+</strong>
                <span>Cities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
