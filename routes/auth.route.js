const express = require('express');
const router = express.Router();

// Validation
const {
    validRegister,
    validLogin
} = require('../helper/valid')

const {
    loginController, 
    registerController,
    activationController
} = require('../controllers/auth.controller');

router.post('/register', validRegister, registerController);
router.get('/activation', activationController)
router.get('/login',validLogin, loginController);

module.exports = router;