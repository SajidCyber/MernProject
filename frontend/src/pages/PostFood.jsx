import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  FileText, 
  Package, 
  Clock, 
  MapPin, 
  ArrowRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import './PostFood.css';

export default function PostFood() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    foodName: '',
    description: '',
    quantity: '',
    expiryHours: '2',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        });
        setLocating(false);
        toast.success('Location captured!');
      },
      () => {
        setLocating(false);
        toast.error('Could not get location');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.foodName || !form.quantity || !form.latitude || !form.longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const expiryTime = new Date(Date.now() + parseInt(form.expiryHours) * 60 * 60 * 1000).toISOString();
      
      await api.post('/foods', {
        foodName: form.foodName,
        description: form.description,
        quantity: form.quantity,
        expiryTime,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      });

      setSuccess(true);
      toast.success('Food posted successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to post food');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="post-food-page">
        <div className="container">
          <motion.div 
            className="success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Food Posted!</h2>
            <p>Your food listing is now visible to nearby receivers.</p>
            <p className="redirect-text">Redirecting to dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-food-page">
      <div className="container">
        <motion.div 
          className="post-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <div className="form-icon">
              <Utensils size={28} />
            </div>
            <h1>Post Surplus Food</h1>
            <p>Share your extra food with those who need it</p>
          </div>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">
                  <Utensils size={16} />
                  Food Name *
                </label>
                <input
                  type="text"
                  name="foodName"
                  value={form.foodName}
                  onChange={handleChange}
                  placeholder="e.g., Fresh Pizza, Biryani, Sandwiches"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the food, dietary info, packaging, etc."
                  className="form-input form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Package size={16} />
                  Quantity *
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 10 servings, 5 kg"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} />
                  Expires In *
                </label>
                <select
                  name="expiryHours"
                  value={form.expiryHours}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <MapPin size={16} />
                  Pickup Location *
                </label>
                <div className="location-group">
                  <button 
                    type="button" 
                    className="btn btn-secondary location-btn"
                    onClick={getLocation}
                    disabled={locating}
                  >
                    {locating ? (
                      <>
                        <Loader2 size={18} className="spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <MapPin size={18} />
                        Use My Location
                      </>
                    )}
                  </button>
                  <span className="location-or">or enter manually</span>
                </div>
                <div className="coords-group">
                  <input
                    type="text"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="form-input"
                    required
                  />
                </div>
                {form.latitude && form.longitude && (
                  <div className="coords-preview">
                    📍 {form.latitude}, {form.longitude}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    Post Food
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
