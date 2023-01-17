const express = require('express');
const { createTrainingLog } = require('../controllers/calendar/create_training_log_list.controller');
const { deleteTrainingLog } = require('../controllers/calendar/delete_training_log.controller');
const { getLogCardioValidation } = require('../controllers/calendar/get_log_cardio_validations.controller');
const { getLogResistanceValidation } = require('../controllers/calendar/get_log_resistance_validations.controller');
const { getTrainingLogList, getTrainingLogDetail } = require('../controllers/calendar/get_training_log_list.controller');
const router = express.Router();

// POST
router.post('/create-training-log', createTrainingLog);
router.post('/training-log-list', getTrainingLogList);

// GET
router.get('/log-cardio-validation-list', getLogCardioValidation);
router.get('/log-resistance-validation-list', getLogResistanceValidation);
router.get('/get-training-log/:trainingId', getTrainingLogDetail);

// DELETE
router.delete('/training-log-delete/:trainingId', deleteTrainingLog)

module.exports = router;