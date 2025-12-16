const Claim = require('../models/Claim');
const Food = require('../models/Food');

exports.createClaim = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ message: 'foodId is required' });

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.status !== 'Available') {
      return res.status(400).json({ message: 'Food is not available' });
    }
    if (String(food.donorId) === req.user.id) {
      return res.status(400).json({ message: 'Donor cannot claim own food' });
    }

    const existing = await Claim.findOne({ foodId, receiverId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Claim already submitted' });

    const claim = await Claim.create({ foodId, receiverId: req.user.id });
    res.status(201).json(claim);
  } catch (error) {
    console.error('Create claim error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved or Rejected
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const claim = await Claim.findById(id).populate('foodId');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    if (String(claim.foodId.donorId) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this claim' });
    }

    claim.status = status;
    await claim.save();

    if (status === 'Approved') {
      await Food.findByIdAndUpdate(claim.foodId._id, { status: 'Claimed' });
    }

    res.json(claim);
  } catch (error) {
    console.error('Update claim error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ receiverId: req.user.id })
      .populate('foodId')
      .sort({ claimedAt: -1 });
    res.json(claims);
  } catch (error) {
    console.error('My claims error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
