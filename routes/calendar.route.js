const express = require('express');
const { createTrainingLog } = require('../controllers/calendar/create_training_log_list.controller');
const { getLogCardioValidation } = require('../controllers/calendar/get_log_cardio_validations.controller');
const router = express.Router();

// POST
router.post('/create-training-log', createTrainingLog);

// GET
router.get('/log-cardio-validation-list', getLogCardioValidation);

module.exports = router;