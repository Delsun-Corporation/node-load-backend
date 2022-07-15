const express = require('express');
const router = express.Router();

// Validation
const {
    validRegister,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator,
    validRegisterFullProfile
} = require('../helper/valid')

const {
    loginController, 
    registerController,
    activationController,
    forgotController,
    changePasswordController,
    registerFullProfileController,
    getAllData,
    otpVerification
} = require('../controllers/auth.controller');

// POST
router.post('/register', validRegister, registerController);
router.post('/register-full-profile', validRegisterFullProfile, registerFullProfileController);
router.post('/forgot-password', forgotPasswordValidator, forgotController);
router.post('/otp-verification', otpVerification);
// PUT
router.put('/change-password', resetPasswordValidator, changePasswordController);
// GET
router.get('/activation', activationController)
router.get('/login',validLogin, loginController);
router.get('/get-all-data', getAllData);

module.exports = router;