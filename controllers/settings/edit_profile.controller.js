const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const _ = require("lodash");
const user_snoozeModel = require("../../models/user_snooze.model");
const decode = require("node-base64-image").decode;
const atob = require('atob');
const { createRandomStringName } = require("../../helper/reusable_function");

exports.getEditProfile = (req, res) => {
  const { id } = req.query;
  const { authorization } = req.headers;

  authModel.findOne(
    {
      id,
    },
    (err, user) => {
      if (err || user == null || user == undefined) {
        return res
          .status(403)
          .json(error("No user found with that ID", res.statusCode));
      }

      if (authorization != user.token) {
        return res.status(401).json(error("Unauthorized", res.statusCode));
      }

      delete user._doc["token"];
      delete user._doc["hashed_password"];
      delete user._doc["salt"];

      return user_snoozeModel.findOne({ user_id: id }, (err, snooze) => {
        if (err || snooze == null || snooze == undefined) {
          return res.json(
            success("Sign in Success", { ...user._doc }, res.statusCode)
          );
        }

        return res.json(
          success(
            "Success getting user profile",
            { ...user._doc, user_snooze_detail: snooze },
            res.statusCode
          )
        );
      });
    }
  );
};

exports.updateEditProfile = (req, res) => {
  const { authorization } = req.headers;
  const {
    id,
    name,
    email,
    country_code,
    mobile,
    date_of_birth,
    country_id,
    facebook,
    gender,
    profile_image,
  } = req.body;

  authModel.findOne(
    {
      id,
    },
    (err, user) => {
      if (err || user == null || user == undefined) {
        return res
          .status(403)
          .json(error("No user found with that ID", res.statusCode));
      }

      if (authorization != user.token) {
        return res.status(401).json(error("Unauthorized", res.statusCode));
      }

      var base64str = profile_image;
      var decoded = atob(base64str);
      const fileSize = (decoded.length/1000000)

      console.log("FileSize: " + fileSize);

      if (fileSize > 20) {
        return res.status(403).json(error("Your image size is more than 20 MB, please use different image", res.statusCode));
      }

      const fileName = createRandomStringName();
      decode(profile_image, {
        fname: `./uploads/profilePicture/${fileName}`,
        ext: "jpg",
      });

      const updatedData = {
        name,
        email,
        country_code,
        mobile,
        date_of_birth,
        country_id,
        facebook,
        gender,
        photo: `${process.env.CLIENT_URL}/uploads/profilePicture/${fileName}.jpg`,
      };

      user = _.extend(user, updatedData);

      return user.save((err, result) => {
        if (err) {
          return res.status(403).json(error("Bad Request", res.statusCode));
        }

        return res.json(
          success("Success getting user profile", result, res.statusCode)
        );
      });
    }
  );
};
