const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createFood, getNearbyFood, updateFoodStatus, myFoods } = require('../controllers/foodController');

router.get('/nearby', auth, getNearbyFood);
router.get('/mine', auth, role('donor'), myFoods);
router.post('/', auth, role('donor'), createFood);
router.patch('/:id/status', auth, role('donor'), updateFoodStatus);

module.exports = router;
