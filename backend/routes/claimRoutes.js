const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createClaim, updateClaimStatus, myClaims } = require('../controllers/claimController');

router.post('/', auth, role('receiver'), createClaim);
router.get('/mine', auth, role('receiver'), myClaims);
router.patch('/:id/status', auth, role('donor'), updateClaimStatus);

module.exports = router;
