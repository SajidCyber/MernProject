import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  List,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
  Package,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Dashboard() {
  const { user, isDonor, isReceiver } = useAuth();
  const [stats, setStats] = useState({ total: 0, available: 0, claimed: 0, expired: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isDonor) {
          const res = await api.get('/foods/mine');
          const foods = res.data || [];
          setStats({
            total: foods.length,
            available: foods.filter(f => f.status === 'Available').length,
            claimed: foods.filter(f => f.status === 'Claimed').length,
            expired: foods.filter(f => f.status === 'Expired').length
          });
          setRecentItems(foods.slice(0, 5));
        } else {
          const res = await api.get('/claims/my-claims');
          const claims = res.data || [];
          setStats({
            total: claims.length,
            available: claims.filter(c => c.status === 'Pending').length,
            claimed: claims.filter(c => c.status === 'Approved').length,
            expired: claims.filter(c => c.status === 'Rejected').length
          });
          setRecentItems(claims.slice(0, 5));
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isDonor]);

  const donorStats = [
    { label: 'Total Posts', value: stats.total, icon: <Package size={24} />, color: 'blue' },
    { label: 'Available', value: stats.available, icon: <Utensils size={24} />, color: 'green' },
    { label: 'Claimed', value: stats.claimed, icon: <CheckCircle size={24} />, color: 'yellow' },
    { label: 'Expired', value: stats.expired, icon: <AlertCircle size={24} />, color: 'red' }
  ];

  const receiverStats = [
    { label: 'Total Claims', value: stats.total, icon: <Package size={24} />, color: 'blue' },
    { label: 'Pending', value: stats.available, icon: <Clock size={24} />, color: 'yellow' },
    { label: 'Approved', value: stats.claimed, icon: <CheckCircle size={24} />, color: 'green' },
    { label: 'Rejected', value: stats.expired, icon: <AlertCircle size={24} />, color: 'red' }
  ];

  const currentStats = isDonor ? donorStats : receiverStats;

  const quickActions = isDonor
    ? [
        { label: 'Post New Food', icon: <PlusCircle size={22} />, to: '/post-food', primary: true },
        { label: 'Manage Claims', icon: <ClipboardList size={22} />, to: '/manage-claims' }
      ]
    : [
        { label: 'Browse Food', icon: <MapPin size={22} />, to: '/foods', primary: true },
        { label: 'My Claims', icon: <List size={22} />, to: '/my-claims' }
      ];

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="dashboard-header"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="header-greeting">
            <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p>Here's what's happening with your {isDonor ? 'food donations' : 'claims'} today.</p>
          </div>
          <div className="header-actions">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className={`btn ${action.primary ? 'btn-primary' : 'btn-secondary'}`}
              >
                {action.icon}
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="stats-grid"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {currentStats.map((stat, i) => (
            <motion.div key={i} className={`stat-card stat-${stat.color}`} variants={fadeInUp}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{loading ? '...' : stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Activity */}
          <motion.div 
            className="dashboard-card recent-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-header">
              <h2>
                <TrendingUp size={20} />
                Recent {isDonor ? 'Posts' : 'Claims'}
              </h2>
              <Link to={isDonor ? '/manage-claims' : '/my-claims'} className="view-all">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading...</p>
                </div>
              ) : recentItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No {isDonor ? 'posts' : 'claims'} yet</h3>
                  <p>{isDonor ? 'Start sharing your surplus food!' : 'Browse available food near you'}</p>
                  <Link to={isDonor ? '/post-food' : '/foods'} className="btn btn-primary">
                    {isDonor ? 'Post Food' : 'Browse Food'}
                  </Link>
                </div>
              ) : (
                <div className="activity-list">
                  {recentItems.map((item, i) => {
                    const food = isDonor ? item : item.foodId;
                    const status = isDonor ? item.status : item.status;
                    return (
                      <div key={i} className="activity-item">
                        <div className="activity-icon">🍽️</div>
                        <div className="activity-content">
                          <div className="activity-title">{food?.foodName || 'Food Item'}</div>
                          <div className="activity-meta">
                            {food?.quantity} • {new Date(item.createdAt || item.claimedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`badge badge-${status === 'Available' || status === 'Approved' ? 'success' : status === 'Pending' || status === 'Claimed' ? 'warning' : 'error'}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div 
            className="dashboard-card tips-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header">
              <h2>
                <Users size={20} />
                Quick Tips
              </h2>
            </div>
            <div className="card-body">
              <div className="tips-list">
                {isDonor ? (
                  <>
                    <div className="tip-item">
                      <span className="tip-icon">📸</span>
                      <div>
                        <strong>Add clear descriptions</strong>
                        <p>Help receivers understand what food you're offering</p>
                      </div>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">⏰</span>
                      <div>
                        <strong>Set accurate expiry times</strong>
                        <p>Ensure food safety by being precise</p>
                      </div>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">📍</span>
                      <div>
                        <strong>Use exact locations</strong>
                        <p>Makes pickup coordination easier</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tip-item">
                      <span className="tip-icon">🔔</span>
                      <div>
                        <strong>Check regularly</strong>
                        <p>New food posts appear frequently</p>
                      </div>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">⚡</span>
                      <div>
                        <strong>Claim quickly</strong>
                        <p>Popular items get claimed fast</p>
                      </div>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">🤝</span>
                      <div>
                        <strong>Coordinate pickup</strong>
                        <p>Contact donors promptly after approval</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
