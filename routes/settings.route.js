const express = require('express');
const { getEditProfile, updateEditProfile } = require('../controllers/settings/edit_profile.controller');
const router = express.Router();

// GET
router.get('/user', getEditProfile);

// POST
router.post('/user-update', updateEditProfile);

module.exports = router;