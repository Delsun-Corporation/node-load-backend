const { validationResult } = require("express-validator");
const User = require('../models/auth.model')
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
const nodemailer = require('nodejs-nodemailer-outlook');
const { errorHandler } = require("../helper/dbErrorHandling");
const { activationEmail } = require("../screens/activationEmail.screen");

exports.loginController = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User has been login'
    })
}

exports.registerController = (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            error: firstError
        });
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    error: "Email is taken, try to login or create account with another email"
                })
            }
        });

        // Generate token
        const token = jwt.sign({
            email,
            password
        },
        `${process.env.JWT_ACCCOUNT_ACTIVATION}`,
        {
            expiresIn: '24h'
        }
        );

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Email verification link",
            html: activationEmail(token, email)
        }

        nodemailer.sendEmail({
            auth: {
                user: `${process.env.NODEMAILER_ACCOUNT}`,
                pass: `${process.env.NODEMAILER_PASSWORD}`
            },
            from: `${process.env.EMAIL_FROM}`,
            to: email,
            subject: "Email verification link",
            html:  activationEmail(token, email),
            onError: (e) => {
                console.log(e)
                return res.status(500).json({
                     error: "Something went wrong, please try again."
                })
            },
            onSuccess: (i) => {
                console.log(i)
                return res.json({
                    success: true,
                    message: `Email has been sent to ${email}`
               })
            }
        })
    }
}

exports.activationController = (req, res) => {
    const token = req.query.token;
    
    if (token) {
        // Verify token
        jwt.verify(token, `${process.env.JWT_ACCCOUNT_ACTIVATION}`, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: "Expired Token. Please Signup again"
                })
            } else {
                // if valid save to database
                // Get email and password from token
                const {email, password} = jwt.decode(token);

                const user = new User({
                    email,
                    password
                })

                user.save((err, user) => {
                    if (err) {
                        return res.status(401).json({
                            error: err
                        })
                    } else {
                        return res.json({
                            success: true,
                            message: "Signup success",
                            user
                        })
                    }
                })
            }
        })
    } else {
        return res.json({
            message: "error happening please try again"
        })
    }
}