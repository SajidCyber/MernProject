const Claim = require('../models/Claim');
const Food = require('../models/Food');
const User = require('../models/User');
const { sendClaimNotification, sendClaimStatusUpdate } = require('../utils/emailService');

exports.createClaim = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ message: 'foodId is required' });

    const food = await Food.findById(foodId).populate('donorId', 'name email phone');
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.status !== 'Available') {
      return res.status(400).json({ message: 'Food is not available' });
    }
    if (String(food.donorId._id) === req.user.id) {
      return res.status(400).json({ message: 'Donor cannot claim own food' });
    }

    const existing = await Claim.findOne({ foodId, receiverId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Claim already submitted' });

    const claim = await Claim.create({ foodId, receiverId: req.user.id });

    // Send email notification to donor
    const receiver = await User.findById(req.user.id).select('name email phone');
    if (food.donorId?.email) {
      sendClaimNotification(
        food.donorId.email,
        food.donorId.name,
        food.foodName,
        receiver.name,
        receiver.email,
        receiver.phone
      ).catch(err => console.error('Failed to send notification:', err));
    }

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

    const claim = await Claim.findById(id)
      .populate('foodId')
      .populate('receiverId', 'name email phone');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    if (String(claim.foodId.donorId) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this claim' });
    }

    claim.status = status;
    await claim.save();

    if (status === 'Approved') {
      await Food.findByIdAndUpdate(claim.foodId._id, { status: 'Claimed' });
    }

    // Send email notification to receiver about status update
    const donor = await User.findById(req.user.id).select('name phone');
    if (claim.receiverId?.email) {
      sendClaimStatusUpdate(
        claim.receiverId.email,
        claim.receiverId.name,
        claim.foodId.foodName,
        status,
        donor.name,
        donor.phone
      ).catch(err => console.error('Failed to send status update:', err));
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

// Get claims for receiver (without strict role check - returns empty for donors)
exports.myClaimsAsReceiver = async (req, res) => {
  try {
    // This returns claims for the user regardless of role
    // If user is a donor, they simply won't have receiver claims
    const claims = await Claim.find({ receiverId: req.user.id })
      .populate('foodId')
      .sort({ claimedAt: -1 });
    res.json(claims);
  } catch (error) {
    console.error('My claims as receiver error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get claims on donor's food items
exports.claimsOnMyFood = async (req, res) => {
  try {
    // First find all food items by this donor
    const donorFoods = await Food.find({ donorId: req.user.id }).select('_id');
    const foodIds = donorFoods.map(f => f._id);

    // Then find all claims on those food items
    const claims = await Claim.find({ foodId: { $in: foodIds } })
      .populate('foodId')
      .populate('receiverId', 'name email phone')
      .sort({ claimedAt: -1 });

    res.json(claims);
  } catch (error) {
    console.error('Claims on my food error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
