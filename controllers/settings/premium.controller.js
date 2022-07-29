const _ = require("lodash");
const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const settingsModel = require("../../models/settings.model");

exports.updatePremiumSettings = (req, res) => {
  const { authorization } = req.headers;
  const {
    about,
    specialization_ids,
    language_id,
    is_auto_topup,
    auto_topup_amount,
    minimum_balance,
    is_card_default,
    credit_card_id,
    premium_profile_permission,
    feed_permission,
  } = req.body;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return settingsModel.findOne({ id }, (err, setting) => {
      if (err || !setting) {
        console.log("Cannot Find setting model, create one instead");
        var setting = new settingsModel();
        const updateData = {
          about,
          specialization_ids,
          language_id,
          is_auto_topup,
          auto_topup_amount,
          minimum_balance,
          is_card_default,
          credit_card_id,
          premium_profile_permission,
          feed_permission,
        };

        setting = _.extend(setting, updateData);

        return setting.save((err, result) => {
          if (err) {
            return res
              .status(500)
              .json(
                error(
                  "Error while saving to server, please try again",
                  res.statusCode
                )
              );
          }

          return res.json(
            success("Success saving user premium setting", null, res.statusCode)
          );
        });
      }

      const updateData = {
        about,
        specialization_ids,
        language_id,
        is_auto_topup,
        auto_topup_amount,
        minimum_balance,
        is_card_default,
        credit_card_id,
        premium_profile_permission,
        feed_permission,
      };

      setting = _.extend(setting, updateData);

      return setting.save((err, result) => {
        if (err) {
          return res
            .status(500)
            .json(
              error(
                "Error while saving to server, please try again",
                res.statusCode
              )
            );
        }

        return res.json(
          success("Success saving user premium setting", null, res.statusCode)
        );
      });
    });
  });
};

exports.getPremiumSettings = (req, res) => {
  const { authorization } = req.headers;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return settingsModel.findOne({id}, 'about specialization_ids language_id is_auto_topup auto_topup_amount minimum_balance is_card_default credit_card_id premium_profile_permission feed_permission', 
    (err, response) => {
        if (err || !response) {
            return res.status(500).json(error("Cannot find user premium's setting, please try again", res.statusCode))
        }

        return res.json(success("Success getting premium's setting data", { ...response._doc }, res.statusCode));
    })
  });
};
