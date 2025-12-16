import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Shield, 
  Users, 
  Leaf, 
  ArrowRight, 
  Star,
  CheckCircle,
  Utensils,
  Building2,
  HandHeart
} from 'lucide-react';
import './Landing.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const features = [
  {
    icon: <MapPin size={28} />,
    title: 'Location-Based Discovery',
    description: 'Find nearby food donations using GPS. Our smart algorithm shows you the closest available meals first.'
  },
  {
    icon: <Clock size={28} />,
    title: 'Real-Time Expiry Tracking',
    description: 'Live countdown timers ensure food safety. Get alerts before items expire so nothing goes to waste.'
  },
  {
    icon: <Shield size={28} />,
    title: 'Secure & Verified',
    description: 'JWT authentication protects your data. Role-based access ensures proper donor-receiver matching.'
  },
  {
    icon: <Users size={28} />,
    title: 'Community Driven',
    description: 'Connect restaurants, households, and NGOs. Build a network of givers and receivers in your area.'
  }
];

const stats = [
  { value: '50K+', label: 'Meals Saved', icon: <Utensils /> },
  { value: '2K+', label: 'Active Donors', icon: <Building2 /> },
  { value: '500+', label: 'NGO Partners', icon: <HandHeart /> },
  { value: '100+', label: 'Cities Covered', icon: <MapPin /> }
];

const steps = [
  { step: '01', title: 'Sign Up', description: 'Create your account as a donor or receiver in seconds' },
  { step: '02', title: 'Post or Browse', description: 'Donors post surplus food, receivers browse nearby listings' },
  { step: '03', title: 'Claim & Connect', description: 'Send claim requests and coordinate pickup seamlessly' },
  { step: '04', title: 'Reduce Waste', description: 'Complete the handoff and make a difference together' }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Restaurant Owner',
    avatar: '👩‍🍳',
    text: 'FoodShare helped us donate over 200 meals last month instead of throwing them away. The platform is incredibly easy to use!'
  },
  {
    name: 'Michael Obi',
    role: 'NGO Coordinator',
    avatar: '👨‍💼',
    text: 'We can now feed 3x more people in our community. The real-time notifications are a game-changer for our operations.'
  },
  {
    name: 'Priya Sharma',
    role: 'Community Volunteer',
    avatar: '👩‍🦱',
    text: 'I love how transparent and safe the process is. Knowing exactly when food expires gives us confidence in what we distribute.'
  }
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
          <motion.div 
            className="hero-blob blob-1"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div 
            className="hero-blob blob-2"
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="hero-badge">
              <Leaf size={16} />
              <span>Sustainable Food Redistribution</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="hero-title">
              Turn Surplus Into
              <span className="hero-title-highlight"> Smiles</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="hero-description">
              Connect food donors with those in need. Our smart platform uses location-based 
              matching and real-time expiry tracking to ensure no good food goes to waste.
            </motion.p>

            <motion.div variants={fadeInUp} className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg hero-btn-primary">
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="hero-trust">
              <div className="hero-trust-avatars">
                {['🧑', '👩', '👨', '👩‍🦰', '🧔'].map((emoji, i) => (
                  <span key={i} className="trust-avatar">{emoji}</span>
                ))}
              </div>
              <div className="hero-trust-text">
                <div className="trust-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <span>Trusted by 10,000+ users worldwide</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero-card-stack">
              <motion.div 
                className="hero-card hero-card-1"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="hero-card-icon">🍕</div>
                <div className="hero-card-content">
                  <h4>Fresh Pizza Available</h4>
                  <p>0.3 km away • Expires in 2h</p>
                </div>
                <span className="badge badge-success">Available</span>
              </motion.div>

              <motion.div 
                className="hero-card hero-card-2"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="hero-card-icon">🥗</div>
                <div className="hero-card-content">
                  <h4>Salad Bowls x10</h4>
                  <p>1.2 km away • Expires in 4h</p>
                </div>
                <span className="badge badge-success">Available</span>
              </motion.div>

              <motion.div 
                className="hero-card hero-card-3"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="hero-card-icon">🍱</div>
                <div className="hero-card-content">
                  <h4>Lunch Boxes x25</h4>
                  <p>0.8 km away • Expires in 3h</p>
                </div>
                <span className="badge badge-warning">Claimed</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--gray-50)"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} className="stat-card" variants={scaleIn}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything You Need to <span className="text-gradient">Make an Impact</span></h2>
            <p className="section-description">
              Our platform combines cutting-edge technology with a mission-driven approach to food waste reduction.
            </p>
          </motion.div>

          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {features.map((feature, i) => (
              <motion.div key={i} className="feature-card" variants={fadeInUp}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Start Saving Food in <span className="text-gradient">4 Simple Steps</span></h2>
          </motion.div>

          <motion.div 
            className="steps-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {steps.map((step, i) => (
              <motion.div key={i} className="step-card" variants={fadeInUp}>
                <div className="step-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {i < steps.length - 1 && <div className="step-connector"></div>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="users-section section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <span className="section-tag">For Everyone</span>
            <h2 className="section-title">Join as a <span className="text-gradient">Donor or Receiver</span></h2>
          </motion.div>

          <motion.div 
            className="user-types-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div className="user-type-card donor-card" variants={scaleIn}>
              <div className="user-type-icon">🤝</div>
              <h3>For Donors</h3>
              <p>Restaurants, hotels, event organizers, and households with surplus food</p>
              <ul className="user-type-list">
                <li><CheckCircle size={18} /> Post food in seconds</li>
                <li><CheckCircle size={18} /> Track claim requests</li>
                <li><CheckCircle size={18} /> Approve/reject pickups</li>
                <li><CheckCircle size={18} /> View impact dashboard</li>
              </ul>
              <Link to="/register?role=donor" className="btn btn-primary btn-full">
                Become a Donor
              </Link>
            </motion.div>

            <motion.div className="user-type-card receiver-card" variants={scaleIn}>
              <div className="user-type-icon">💚</div>
              <h3>For Receivers</h3>
              <p>NGOs, community kitchens, shelters, and individuals in need</p>
              <ul className="user-type-list">
                <li><CheckCircle size={18} /> Browse nearby listings</li>
                <li><CheckCircle size={18} /> Claim available food</li>
                <li><CheckCircle size={18} /> Get real-time updates</li>
                <li><CheckCircle size={18} /> Coordinate pickups</li>
              </ul>
              <Link to="/register?role=receiver" className="btn btn-secondary btn-full">
                Become a Receiver
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">Loved by <span className="text-gradient">Our Community</span></h2>
          </motion.div>

          <motion.div 
            className="testimonials-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} className="testimonial-card" variants={fadeInUp}>
                <div className="testimonial-content">
                  <p>"{t.text}"</p>
                </div>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-gradient"></div>
        </div>
        <div className="container">
          <motion.div 
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of donors and receivers working together to eliminate food waste in their communities.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Now — It's Free
                <Heart size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Leaf size={24} />
                <span>FoodShare</span>
              </div>
              <p>Making food waste a thing of the past, one meal at a time.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <a href="#">How it Works</a>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact</a>
                <a href="#">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 FoodShare. Built with 💚 to fight food waste.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
