const express = require('express');
const { addAccountType } = require('../controllers/account.controller');
const router = express.Router();

// POST
router.post('/account', addAccountType);

module.exports = router;