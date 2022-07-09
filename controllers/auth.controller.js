const { validationResult } = require("express-validator");
const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');
const nodemailer = require("nodejs-nodemailer-outlook");
const { errorHandler } = require("../helper/dbErrorHandling");
const { activationEmail } = require("../screens/activationEmail.screen");
const {
  forgotPasswordEmail,
} = require("../screens/forgotPasswordEmail.screen");
const { success, error, validation } = require("../helper/baseJsonResponse");
const _ = require("lodash");
const crypto = require("crypto");
const Account = require("../models/account.model");
const Snooze = require("../models/user_snooze.model");

exports.loginController = (req, res) => {
  const { email, password } = req.query;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json(validation(firstError));
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json(
            error(
              "User with that email does not exist, please sign up or activate your account with email that has been sent",
              res.statusCode
            )
          );
      }

      // Authentication
      if (!user.authenticate(password)) {
        return res
          .status(400)
          .json(error("Either email or password do not match", res.statusCode));
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

      const newBioToSave = {
        token
      }
  
      user = _.extend(user, newBioToSave);

      return user.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json(error("Error resetting user password", res.statusCode));
        }

        Snooze.findOne({
          user_id: result.id
        }, (err, account) => {
          const objectUserToReturn = {
            email: result.email,
            token: result.token,
            name: result.name,
            is_active: result.is_active,
            is_profile_complete: result.is_profile_complete,
            email_verified_at: result.email_verified_at,
            is_online: result.is_snooze,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            date_of_birth: result.date_of_birth,
            gender: result.gender,
            height: result.height,
            weight: result.weight,
            location: result.location,
            phone_area: result.phone_area,
            phone_number: result.phone_number,
            account_id: result.account_id,
          }

          if (err) {
            return res.json(
              success("Sign in Success", { user: objectUserToReturn, token }, res.statusCode)
            );
          }

          return res.json(
            success("Sign in Success", { user: { ...objectUserToReturn, user_snooze_detail: account}, token }, res.statusCode)
          );
        })
      });
    });
  }
};

exports.registerController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json(validation(firstError));
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res
          .status(400)
          .json(
            error(
              "Email is taken, try to login or create account with another email",
              res.statusCode
            )
          );
      }

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
          return res
            .status(500)
            .json(
              error("Something went wrong, please try again", res.statusCode)
            );
        },
        onSuccess: (i) => {
          return res.json(
            success(`Email has been sent to ${email}`, null, res.statusCode)
          );
        },
      });
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
          return res
            .status(401)
            .json(error("Expired Token. Please signup again", res.statusCode));
        } else {
          // if valid save to database
          // Get email and password from token
          const { email, password } = jwt.decode(token);
          const email_verified_at = new Date();

          const user = new User({
            email,
            password,
            email_verified_at
          });

          user.save((err, user) => {
            if (err) {
              console.log(err);
              return res.status(401).json(error(err.message, res.statusCode));
            } else {
              return res.redirect("https://www.load-peakyourperformance.com/");
            }
          });
        }
      }
    );
  } else {
    return res
      .status(500)
      .json(error("Unexpected error from server", res.statusCode));
  }
};

exports.forgotController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json(validation(firstError));
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json(error("User with that email does not exist", res.statusCode));
        }

        // if user exist, change his/her password right away
        const newPassword = crypto.randomBytes(8).toString("hex");

        const updatedFields = {
          password: newPassword,
        };

        user = _.extend(user, updatedFields);

        return user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json(error("Error resetting user password", res.statusCode));
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
              return res
                .status(500)
                .json(
                  error(
                    "Error when sending email, please try again",
                    res.statusCode
                  )
                );
            },
            onSuccess: (i) => {
              console.log(i);
              return res.json(
                success(`Email has been sent to ${email}`, null, res.statusCode)
              );
            },
          });
        });
      }
    );
  }
};

exports.changePasswordController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  const { authorization } = req.headers;

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json(validation(firstError));
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json(error("User with that email does not exist", res.statusCode));
    }

    if (user.token !== authorization) {
      return res.status(401).json(error("Unautorized", res.statusCode));
    }

    const updatedFields = {
      password: password,
    };

    user = _.extend(user, updatedFields);

    return user.save((err, result) => {
      if (err) {
        return res
          .status(400)
          .json(error("Error resetting user password", res.statusCode));
      }

      return res.json(success("Password successfully changed", null, res.statusCode));
    });
  })
};

exports.registerFullProfileController = (req, res) => {
  const validationErrors = validationResult(req);
  const {
    date_of_birth,
    name,
    gender,
    weight,
    height,
    location,
    phone_area,
    phone_number,
    email
  } = req.body;
  const { authorization } = req.headers;

  if (!validationErrors.isEmpty()) {
    const firstError = validationErrors.array().map((error) => error.msg)[0];
    return res.status(422).json(validation(firstError));
  }

  User.findOne({
    email
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json(error("User not found", res.statusCode));
    }

    if (user.token !== authorization) {
      return res.status(401).json(error("Unautorized", res.statusCode));
    }

    const newBioToSave = {
      date_of_birth,
      name,
      gender,
      weight,
      height,
      phone_area,
      phone_number,
      location,
      is_profile_complete: true
    }

    user = _.extend(user, newBioToSave);

    return user.save((err, result) => {
      if (err) {
        return res
          .status(400)
          .json(error("Error resetting user password", res.statusCode));
      }

      return res.json(success("Successfully register user full profile", { user: result }, res.statusCode));
    });
  })
}

exports.getAllData = (req, res) => {
  const { authorization } = req.headers;

  accountModel.find({}, (err, accounts) => {

    return res.json(success("Success Get All Data", { accounts }, res.statusCode));
  })
}
