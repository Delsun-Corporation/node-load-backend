const express = require('express');
const { createCreditCardList, getCreditCardList, updateDefaultPaymentMethod } = require('../controllers/settings/credit_card_controller');
const { getEditProfile, updateEditProfile } = require('../controllers/settings/edit_profile.controller');
const { updatePremiumSettings, getPremiumSettings } = require('../controllers/settings/premium.controller');
const { updateProfessionalSettings, getProfessionalData } = require('../controllers/settings/professional.controller');
const { getTrainingData, updateTrainingSettings, getTrainingUnitsData, getTrainingPhysicalLevelData, getTrainingTimeUnderTension } = require('../controllers/settings/training.controller');
const router = express.Router();

// GET
router.get('/user', getEditProfile);
router.get('/get-setting-primium', getPremiumSettings);
router.get('/get-credit-card', getCreditCardList);
router.get('/get-professional-profile-details', getProfessionalData);
router.get('/get-setting-program', getTrainingData);
router.get('/all-training-units-list', getTrainingUnitsData);
router.get('/all-physical-activity-level-list', getTrainingPhysicalLevelData);
router.get('/time-under-tention', getTrainingTimeUnderTension);

// POST
router.post('/user-update', updateEditProfile);
router.post('/setting-create-update-primium', updatePremiumSettings);
router.post('/create-credit-card', createCreditCardList);
router.post('/update-default-payment', updateDefaultPaymentMethod);
router.post('/create-or-update-professional-profile', updateProfessionalSettings);
router.post('/setting-create-update-program', updateTrainingSettings);

module.exports = router;