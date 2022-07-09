const express = require('express');
const { addAccountType, updateAccountType, updateAccountSnooze } = require('../controllers/account.controller');
const router = express.Router();

// POST
router.post('/account', addAccountType);
router.post('/update-account-type', updateAccountType);
router.post('/update-account-snooze', updateAccountSnooze);

module.exports = router;