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
const available_timesModel = require("../models/available_times.model");
const training_typesModel = require("../models/training/training_types.model");
const { activationEmailv2 } = require("../screens/activationEmailV2.screen");
const {
  forgotPasswordEmailv2,
} = require("../screens/forgotPasswordEmailv2.screen");
const training_intensityModel = require("../models/training/training_intensity.model");
const languagesModel = require("../models/languages.model");
const professional_typesModel = require("../models/professional_types.model");
const cancelation_policiesModel = require("../models/cancelation_policies.model");
const payment_optionsModel = require("../models/payment_options.model");
const professional_scheduleModel = require("../models/professional_schedule.model");
const specializationModel = require("../models/specialization.model");
const race_distanceModel = require("../models/race_distance.model");
const currenciesModel = require("../models/currencies.model");
const servicesModel = require("../models/services.model");
const countries = require("../models/countries.model");
const regionsModel = require("../models/regions.model");
const preset_training_programsModel = require("../models/training/preset_training_programs.model");
const body_partsModel = require("../models/body_parts.model");
const { changePassword } = require("../screens/changePassword.screen");

function getDefaultUserId() {
  return Math.round(Date.now() + Math.random());
}

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
        token,
      };

      user = _.extend(user, newBioToSave);

      return user.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json(error("Error resetting user password", res.statusCode));
        }

        delete result._doc["hashed_password"];
        delete result._doc["salt"];

        Snooze.findOne(
          {
            user_id: result.id,
          },
          (err, account) => {
            if (err || account == null || account == undefined) {
              return res.json(
                success(
                  "Sign in Success",
                  { user: result, token },
                  res.statusCode
                )
              );
            }

            return res.json(
              success(
                "Sign in Success",
                {
                  user: { ...result._doc, user_snooze_detail: account },
                  token,
                },
                res.statusCode
              )
            );
          }
        );
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
        html: activationEmailv2(token, email),
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
            email_verified_at,
            id: getDefaultUserId(),
          });

          user.save((err, user) => {
            if (err) {
              console.log(err);
              return res.status(401).json(error(err.message, res.statusCode));
            } else {
              return res.redirect(
                "https://www.load-peakyourperformance.com/load-app-activated"
              );
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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const today = new Date();

        const updatedFields = {
          otp: otp,
          otp_date: today,
        };

        user = _.extend(user, updatedFields);

        return user.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json(error("Error saving user OTP", res.statusCode));
          }

          nodemailer.sendEmail({
            auth: {
              user: `${process.env.NODEMAILER_ACCOUNT}`,
              pass: `${process.env.NODEMAILER_PASSWORD}`,
            },
            from: `${process.env.EMAIL_FROM}`,
            to: email,
            subject: "Password Change Request",
            html: forgotPasswordEmailv2(otp, email),
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
  const { email, password, is_from_otp } = req.body;
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

    const name = user.name

    if (
      is_from_otp !== null &&
      is_from_otp !== undefined &&
      is_from_otp === true
    ) {
      const updatedFields = {
        password: password
      };

      user = _.extend(user, updatedFields);

      return user.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json(
              error(
                "Error resetting user password from forget password",
                res.statusCode
              )
            );
        }

        nodemailer.sendEmail({
          auth: {
            user: `${process.env.NODEMAILER_ACCOUNT}`,
            pass: `${process.env.NODEMAILER_PASSWORD}`,
          },
          from: `${process.env.EMAIL_FROM}`,
          to: email,
          subject: "Success Change Password",
          html: changePassword(name),
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
              success("Change password successfully", null, res.statusCode)
            );
          },
        });
      });
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

      nodemailer.sendEmail({
        auth: {
          user: `${process.env.NODEMAILER_ACCOUNT}`,
          pass: `${process.env.NODEMAILER_PASSWORD}`,
        },
        from: `${process.env.EMAIL_FROM}`,
        to: email,
        subject: "Success Change Password",
        html: changePassword(name),
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
            success("Change password successfully", null, res.statusCode)
          );
        },
      });
    });
  });
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
    email,
  } = req.body;
  const { authorization } = req.headers;

  if (!validationErrors.isEmpty()) {
    const firstError = validationErrors.array().map((error) => error.msg)[0];
    return res.status(422).json(validation(firstError));
  }

  User.findOne(
    {
      email,
    },
    (err, user) => {
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
        is_profile_complete: true,
      };

      user = _.extend(user, newBioToSave);

      return user.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json(error("Error resetting user password", res.statusCode));
        }

        return res.json(
          success(
            "Successfully register user full profile",
            { user: result },
            res.statusCode
          )
        );
      });
    }
  );
};

exports.getAllData = (req, res) => {
  const { authorization } = req.headers;

  Account.find({is_active: 1}, (err, accounts) => {
    if (err) {
      return res
        .status(500)
        .json(error("Error getting Account Types", res.statusCode));
    }
    return available_timesModel.find({ is_active: 1 }, (err, available_times) => {
      if (err) {
        return res
          .status(500)
          .json(error("Error getting Available Times", res.statusCode));
      }
      return training_typesModel.find({ is_active: 1 }, (err, training_types) => {
        if (err) {
          return res
            .status(500)
            .json(error("Error getting Training Types", res.statusCode));
        }

        return training_intensityModel.find({ is_active: 1 }, (err, training_intensity) => {
          if (err) {
            return res
              .status(500)
              .json(error("Error getting Training Intensty", res.statusCode));
          }

          return languagesModel.find({ is_active: 1 }, (err, languages) => {
            if (err) {
              return res
                .status(500)
                .json(error("Error getting languages", res.statusCode));
            }

            return professional_typesModel.find({ is_active: 1 }, (err, professional_types) => {

              return cancelation_policiesModel.find({is_active: 1}, (err, cancellation_policy) => {

                return payment_optionsModel.find({is_active: 1}, (err, payment_options) => {

                  return professional_scheduleModel.find({is_active: 1}, (err, professional_schedule_advance_booking) => {

                    return specializationModel.find({is_active: "1"}, (err, specialization) => {

                      return race_distanceModel.find({is_active: 1}, (err, settings_race_distances) => {

                        return currenciesModel.find({is_active: 1}, (err, currencies) => {

                          return servicesModel.find({is_active: 1}, (err, services) => {

                            return countries.find({is_active: 1}, (err, countries) => {

                              return regionsModel.find({is_active: 1}, (err, regions) => {

                                return preset_training_programsModel.find({is_active: 1, status: "CARDIO"}, (err, cardio_preset_training_program) => {

                                  return preset_training_programsModel.find({is_active: 1, status: "RESISTANCE"}, (err, resistance_preset_training_program) => {
                                    
                                    return body_partsModel.find({is_active: "1"}, (err, body_parts) => {

                                      return res.json(
                                        success(
                                          "Success Get All Data",
                                          {
                                            accounts,
                                            available_times,
                                            training_types,
                                            training_intensity,
                                            languages,
                                            professional_types,
                                            cancellation_policy,
                                            payment_options,
                                            professional_schedule_advance_booking,
                                            specialization,
                                            settings_race_distances,
                                            currencies,
                                            services,
                                            countries,
                                            regions,
                                            cardio_preset_training_program,
                                            resistance_preset_training_program,
                                            body_parts
                                          },
                                          res.statusCode
                                        )
                                      );

                                    })
                                  }); 
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          });
        });
      });
    });
  });
};

exports.otpVerification = (req, res) => {
  const { otp, email } = req.body;

  if (otp == undefined || otp == null || email == undefined || email == null) {
    return res.status(403).json(error("Bad Request", res.statusCode));
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json(error("User not found", res.statusCode));
    }

    if (otp != user._doc.otp) {
      return res.status(401).json(error("OTP is not valid", res.statusCode));
    }

    const today = new Date();
    const userOtp = user._doc.otp_date;

    if (userOtp === undefined || userOtp === null) {
      return res
        .status(401)
        .json(error("OTP date is not valid", res.statusCode));
    }

    const differenceDate = today - userOtp;
    var diffMins = Math.round(((differenceDate % 86400000) % 3600000) / 60000);

    if (diffMins >= 10) {
      return res.status(401).json(error("OTP expired", res.statusCode));
    }

    // If Valid, Delete OTP for better security
    user.set("otp", undefined, { strict: false });
    user.set("otp_date", undefined, { strict: false });

    return user.save((err, result) => {
      if (err) {
        return res
          .status(500)
          .json(error("Error delete user otp", res.statusCode));
      }

      return res.json(success("OTP is Valid!", null, res.statusCode));
    });
  });
};
