const express = require('express');
const { getEditProfile, updateEditProfile } = require('../controllers/settings/edit_profile.controller');
const { updatePremiumSettings, getPremiumSettings } = require('../controllers/settings/premium.controller');
const router = express.Router();

// GET
router.get('/user', getEditProfile);
router.get('/get-setting-primium', getPremiumSettings);

// POST
router.post('/user-update', updateEditProfile);
router.post('/setting-create-update-primium', updatePremiumSettings);

module.exports = router;