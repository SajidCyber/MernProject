const Food = require('../models/Food');

exports.createFood = async (req, res) => {
  try {
    const { foodName, description, quantity, expiryTime, latitude, longitude } = req.body;
    if (!foodName || !quantity || !expiryTime || latitude == null || longitude == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const food = await Food.create({
      donorId: req.user.id,
      foodName,
      description,
      quantity,
      expiryTime,
      location: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
    });

    res.status(201).json(food);
  } catch (error) {
    console.error('Create food error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNearbyFood = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const foods = await Food.find({ status: { $in: ['Available', 'Claimed'] } })
      .where('location')
      .near({
        center: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
        maxDistance: Number(maxDistance),
        spherical: true,
      })
      .sort({ expiryTime: 1 });

    res.json(foods);
  } catch (error) {
    console.error('Nearby food error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFoodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Available', 'Claimed', 'Expired', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const food = await Food.findOneAndUpdate(
      { _id: id, donorId: req.user.id },
      { status },
      { new: true }
    );
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    console.error('Update food error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    console.error('My foods error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
