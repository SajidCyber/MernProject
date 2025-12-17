const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createClaim, updateClaimStatus, myClaims, claimsOnMyFood, myClaimsAsReceiver } = require('../controllers/claimController');

router.post('/', auth, role('receiver'), createClaim);
router.get('/mine', auth, role('receiver'), myClaims);
router.get('/my-claims', auth, myClaimsAsReceiver); // For fetching receiver's claims without strict role check
router.get('/on-my-food', auth, role('donor'), claimsOnMyFood);
router.patch('/:id/status', auth, role('donor'), updateClaimStatus);

module.exports = router;
