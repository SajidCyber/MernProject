const Food = require('../models/Food');

const checkAndExpireFood = async () => {
  const now = new Date();
  await Food.updateMany({ expiryTime: { $lt: now }, status: { $ne: 'Expired' } }, { status: 'Expired' });
};

const startExpiryScheduler = (intervalMs = 60 * 1000) => {
  setInterval(async () => {
    try {
      await checkAndExpireFood();
    } catch (error) {
      console.error('Expiry scheduler error:', error.message);
    }
  }, intervalMs);
};

module.exports = { startExpiryScheduler, checkAndExpireFood };
