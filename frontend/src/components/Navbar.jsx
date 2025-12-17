import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Menu, 
  X, 
  LogOut, 
  User, 
  LayoutDashboard, 
  PlusCircle, 
  List,
  Package,
  ClipboardList,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, isDonor, isReceiver } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLanding = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''} ${isLanding && !scrolled ? 'transparent' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Leaf size={26} />
          <span>FoodShare</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav desktop-nav">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/foods" className={`nav-link ${location.pathname === '/foods' ? 'active' : ''}`}>
                <List size={18} />
                Browse Food
              </Link>
              {isDonor && (
                <Link to="/post-food" className={`nav-link ${location.pathname === '/post-food' ? 'active' : ''}`}>
                  <PlusCircle size={18} />
                  Post Food
                </Link>
              )}
              {isDonor && (
                <Link to="/manage-claims" className={`nav-link ${location.pathname === '/manage-claims' ? 'active' : ''}`}>
                  <ClipboardList size={18} />
                  Manage Claims
                </Link>
              )}
              {isReceiver && (
                <Link to="/my-claims" className={`nav-link ${location.pathname === '/my-claims' ? 'active' : ''}`}>
                  <Package size={18} />
                  My Claims
                </Link>
              )}
            </>
          ) : (
            <>
              <a href="#features" className="nav-link">Features</a>
              <a href="#how" className="nav-link">How It Works</a>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-nav">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-menu-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user?.name}</span>
                <ChevronDown size={16} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="dropdown-name">{user?.name}</div>
                        <div className="dropdown-email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/dashboard" className="dropdown-item">
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      <User size={18} />
                      Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container">
              {isAuthenticated ? (
                <>
                  <div className="mobile-user">
                    <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-name">{user?.name}</div>
                      <div className="user-role">{user?.role}</div>
                    </div>
                  </div>
                  <div className="mobile-divider"></div>
                  <Link to="/dashboard" className="mobile-link">
                    <LayoutDashboard size={20} />
                    Dashboard
                  </Link>
                  <Link to="/foods" className="mobile-link">
                    <List size={20} />
                    Browse Food
                  </Link>
                  {isDonor && (
                    <Link to="/post-food" className="mobile-link">
                      <PlusCircle size={20} />
                      Post Food
                    </Link>
                  )}
                  {isDonor && (
                    <Link to="/manage-claims" className="mobile-link">
                      <ClipboardList size={20} />
                      Manage Claims
                    </Link>
                  )}
                  {isReceiver && (
                    <Link to="/my-claims" className="mobile-link">
                      <Package size={20} />
                      My Claims
                    </Link>
                  )}
                  <div className="mobile-divider"></div>
                  <button onClick={handleLogout} className="mobile-link logout">
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a href="#features" className="mobile-link">Features</a>
                  <a href="#how" className="mobile-link">How It Works</a>
                  <div className="mobile-divider"></div>
                  <Link to="/login" className="mobile-link">Sign In</Link>
                  <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
