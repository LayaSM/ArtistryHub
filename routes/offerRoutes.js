const express = require('express');
const controller = require('../controllers/offerController');
const { isLoggedIn, isSeller, isNotSeller } = require('../middleware/auth');
const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, isNotSeller, controller.makeOffer);
router.get('/offers', isLoggedIn, isSeller, controller.viewAllOffers);
router.put('/offers/:offerId', isLoggedIn, isSeller, controller.acceptOffer);

module.exports = router;
