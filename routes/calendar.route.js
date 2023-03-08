const express = require('express');
const { checkProgramIsAvailable } = require('../controllers/calendar/check_program_still_available.controller');
const { createTrainingLog } = require('../controllers/calendar/create_training_log_list.controller');
const { createTrainingProgram } = require('../controllers/calendar/create_training_program.controller');
const { deleteTrainingLog } = require('../controllers/calendar/delete_training_log.controller');
const { checkTrainingProgram } = require('../controllers/calendar/get_check_training_program.contoller');
const { getLogCardioValidation } = require('../controllers/calendar/get_log_cardio_validations.controller');
const { getLogResistanceValidation } = require('../controllers/calendar/get_log_resistance_validations.controller');
const { getTrainingLogList, getTrainingLogDetail } = require('../controllers/calendar/get_training_log_list.controller');
const router = express.Router();

// POST
router.post('/create-training-log', createTrainingLog);
router.post('/training-log-list', getTrainingLogList);
router.post('/check-program-is-available', checkProgramIsAvailable);
router.post('/create-training-program', createTrainingProgram);

// GET
router.get('/log-cardio-validation-list', getLogCardioValidation);
router.get('/log-resistance-validation-list', getLogResistanceValidation);
router.get('/get-training-log/:trainingId', getTrainingLogDetail);
router.get('/program-flags', checkTrainingProgram);

// DELETE
router.delete('/training-log-delete/:trainingId', deleteTrainingLog)

module.exports = router;