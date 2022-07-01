const express = require('express');
const router = express.Router();

// Validation
const {
    validRegister,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helper/valid')

const {
    loginController, 
    registerController,
    activationController,
    forgotController,
    changePasswordController
} = require('../controllers/auth.controller');

router.post('/register', validRegister, registerController);
router.post('/forgot-password', forgotPasswordValidator, forgotController);
router.put('/change-password', resetPasswordValidator, changePasswordController);
router.get('/activation', activationController)
router.get('/login',validLogin, loginController);

module.exports = router;