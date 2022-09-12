const express = require('express');
const { createTrainingLog } = require('../controllers/calendar/create_training_log_list.controller');
const router = express.Router();

// POST
router.post('/create-training-log', createTrainingLog);

module.exports = router;