// Validations Helpers
const {
    check
} = require('express-validator');

exports.validRegister = [
    check('email').not().isEmpty().withMessage('Must be a valid email address'),
    check('password', 'password is required').not().isEmpty(),
    check('password').isLength({
        min: 8
    }).withMessage('Password must contain at leat 8 characters').matches(/\d/).withMessage('password must contain a number'),
    check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Password must contain at least 1 lower or uppercase letter')
]

exports.validRegisterFullProfile = [
    check('date_of_birth').not().isEmpty().withMessage('Date of birth must not empty!'),
    check('name').not().isEmpty().withMessage('Name must not empty!'),
    check('name').isLength({max: 100}).withMessage('Name should not have more thank 100 character'),
    check('gender').not().isEmpty().withMessage('Gender must not empty!'),
    check('height').not().isEmpty().withMessage('Height must not empty!'),
    check('weight').not().isEmpty().withMessage('Weight must not empty!')
]

exports.validLogin = [
    check('email').isEmail()
    .withMessage('Must be a valid email address'),
    check('email').not().isEmpty().withMessage('Must be a valid email address'),
    check('password', 'password is required').not().isEmpty(),
    check('password').isLength({
        min: 6
    }).withMessage('Password must contain at leat 6 characters').matches(/\d/).withMessage('password must contain a number')
]

// Forgot password
exports.forgotPasswordValidator = [
    check('email').not().isEmpty().isEmail()
    .withMessage('Must be a valid email address')
]

// Reset password
exports.resetPasswordValidator = [
    check('password', 'password is required').not().isEmpty(),
    check('password').isLength({
        min: 8
    }).withMessage('Password must contain at leat 8 characters').matches(/\d/).withMessage('password must contain a number'),
    check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Password must contain at least 1 lower or uppercase letter')
]