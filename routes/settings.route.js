const express = require('express');
const { createCreditCardList, getCreditCardList } = require('../controllers/settings/credit_card_controller');
const { getEditProfile, updateEditProfile } = require('../controllers/settings/edit_profile.controller');
const { updatePremiumSettings, getPremiumSettings } = require('../controllers/settings/premium.controller');
const router = express.Router();

// GET
router.get('/user', getEditProfile);
router.get('/get-setting-primium', getPremiumSettings);
router.get('/get-credit-card', getCreditCardList);

// POST
router.post('/user-update', updateEditProfile);
router.post('/setting-create-update-primium', updatePremiumSettings);
router.post('/create-credit-card', createCreditCardList);

module.exports = router;