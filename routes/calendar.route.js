const express = require('express');
const { createTrainingLog } = require('../controllers/calendar/create_training_log_list.controller');
const { getLogCardioValidation } = require('../controllers/calendar/get_log_cardio_validations.controller');
const { getLogResistanceValidation } = require('../controllers/calendar/get_log_resistance_validations.controller');
const { getTrainingLogList } = require('../controllers/calendar/get_training_log_list.controller');
const router = express.Router();

// POST
router.post('/create-training-log', createTrainingLog);
router.post('/training-log-list', getTrainingLogList);

// GET
router.get('/log-cardio-validation-list', getLogCardioValidation);
router.get('/log-resistance-validation-list', getLogResistanceValidation);

module.exports = router;