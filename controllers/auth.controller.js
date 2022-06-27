const { validationResult } = require("express-validator");
const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');
const nodemailer = require("nodejs-nodemailer-outlook");
const { errorHandler } = require("../helper/dbErrorHandling");
const { activationEmail } = require("../screens/activationEmail.screen");
const { forgotPasswordEmail } = require("../screens/forgotPasswordEmail.screen");
const { successResp, errorResp } = require("../helper/baseJsonResponse");
const _ = require("lodash");
const crypto = require("crypto");

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          ...errorResp,
          error: "User with that email does not exist, please sign up.",
        });
      }

      // Authentication
      if (!user.authenticate(password)) {
        return res.status(400).json({
            ...errorResp,
          error: "Either email or password do not match",
        });
      }

      const { _id } = user;
      const userId = _id.toString();

      //Generate Token
      const token = jwt.sign(
        {
          userId: userId,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        ...successResp,
        message: "Sign in Success",
        token,
        user
      });
    });
  }
};

exports.registerController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error:
            "Email is taken, try to login or create account with another email",
        });
      }
    });

    // Generate token
    const token = jwt.sign(
      {
        email,
        password,
      },
      `${process.env.JWT_ACCCOUNT_ACTIVATION}`,
      {
        expiresIn: "15m",
      }
    );

    nodemailer.sendEmail({
      auth: {
        user: `${process.env.NODEMAILER_ACCOUNT}`,
        pass: `${process.env.NODEMAILER_PASSWORD}`,
      },
      from: `${process.env.EMAIL_FROM}`,
      to: email,
      subject: "Email verification link",
      html: activationEmail(token, email),
      onError: (e) => {
        console.log(e);
        return res.status(500).json({
          error: "Something went wrong, please try again.",
        });
      },
      onSuccess: (i) => {
        console.log(i);
        return res.json({
          success: true,
          message: `Email has been sent to ${email}`,
        });
      },
    });
  }
};

exports.activationController = (req, res) => {
  const token = req.query.token;

  if (token) {
    // Verify token
    jwt.verify(
      token,
      `${process.env.JWT_ACCCOUNT_ACTIVATION}`,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: "Expired Token. Please Signup again",
          });
        } else {
          // if valid save to database
          // Get email and password from token
          const { email, password } = jwt.decode(token);

          const user = new User({
            email,
            password,
          });

          user.save((err, user) => {
            if (err) {
              return res.status(401).json({
                error: err,
              });
            } else {
              return res.json({
                success: true,
                message: "Signup success",
                user,
              });
            }
          });
        }
      }
    );
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

exports.forgotController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        // if user exist, change his/her password right away
        const newPassword = crypto.randomBytes(16).toString("hex");

        const updatedFields = {
          password: newPassword
        };

        user = _.extend(user, updatedFields);

        return user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }

          nodemailer.sendEmail({
            auth: {
              user: `${process.env.NODEMAILER_ACCOUNT}`,
              pass: `${process.env.NODEMAILER_PASSWORD}`,
            },
            from: `${process.env.EMAIL_FROM}`,
            to: email,
            subject: "Load App - Forgot your password",
            html: forgotPasswordEmail(newPassword, email),
            onError: (e) => {
              console.log(e);
              return res.status(500).json({
                error: "Something went wrong, please try again.",
              });
            },
            onSuccess: (i) => {
              console.log(i);
              return res.json({
                success: true,
                message: `Email has been sent to ${email}`,
              });
            },
          });
        });
      }
    );
  }
};

