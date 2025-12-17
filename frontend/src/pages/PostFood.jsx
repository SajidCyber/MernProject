import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle,
  Camera,
  X,
  ImageIcon,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PostFood.css';

// Fix for default marker icon in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component to recenter map when position changes
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

export default function PostFood() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    foodName: '',
    description: '',
    quantity: '',
    expiryHours: '2',
    latitude: '',
    longitude: ''
  });
  const [mapPosition, setMapPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update form when map position changes
  useEffect(() => {
    if (mapPosition) {
      setForm(prev => ({
        ...prev,
        latitude: mapPosition.lat.toFixed(6),
        longitude: mapPosition.lng.toFixed(6)
      }));
    }
  }, [mapPosition]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setMapPosition(newPosition);
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
        toast.error('Could not get location. Click on the map to set location.');
      }
    );
  };

  // Auto-trigger GPS location on page load
  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.foodName || !form.quantity || !form.latitude || !form.longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const expiryTime = new Date(Date.now() + parseInt(form.expiryHours) * 60 * 60 * 1000).toISOString();
      
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('foodName', form.foodName);
      formData.append('description', form.description);
      formData.append('quantity', form.quantity);
      formData.append('expiryTime', expiryTime);
      formData.append('latitude', parseFloat(form.latitude));
      formData.append('longitude', parseFloat(form.longitude));
      if (image) {
        formData.append('image', image);
      }

      await api.post('/foods', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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

              <div className="form-group full-width">
                <label className="form-label">
                  <Camera size={16} />
                  Food Image
                </label>
                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Food preview" className="image-preview" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={removeImage}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload-label">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="image-input"
                      />
                      <div className="upload-placeholder">
                        <ImageIcon size={32} />
                        <span>Click to upload food image</span>
                        <span className="upload-hint">JPEG, PNG, GIF up to 5MB</span>
                      </div>
                    </label>
                  )}
                </div>
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
                  <option value="24">1 day</option>
                  <option value="48">2 days</option>
                  <option value="72">3 days</option>
                  <option value="96">4 days</option>
                  <option value="120">5 days</option>
                  <option value="168">1 week</option>
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
                        <Navigation size={18} />
                        Use My Current Location
                      </>
                    )}
                  </button>
                  <span className="location-or">or click on the map to select</span>
                </div>
                
                <div className="map-container">
                  <MapContainer
                    center={mapPosition || { lat: 20.5937, lng: 78.9629 }}
                    zoom={mapPosition ? 15 : 5}
                    style={{ height: '300px', width: '100%', borderRadius: '12px' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={mapPosition} setPosition={setMapPosition} />
                    <MapUpdater position={mapPosition} />
                  </MapContainer>
                </div>

                {form.latitude && form.longitude && (
                  <div className="coords-preview">
                    📍 Selected: {form.latitude}, {form.longitude}
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
