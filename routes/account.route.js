const express = require('express');
const { addAccountType, updateAccountType } = require('../controllers/account.controller');
const router = express.Router();

// POST
router.post('/account', addAccountType);
router.post('/update-account-type', updateAccountType);

module.exports = router;