const { error, success } = require("../../helper/baseJsonResponse");
const validateToken = require("../../helper/token_checker");
const resistance_log_validationModel = require("../../models/calendar/resistance_log_validation.model");
const settingsModel = require("../../models/settings.model");

exports.getLogResistanceValidation = (req, res) => {
    validateToken(req, res, (user) => {
        const userId = user.id;

        // Get hr max from setting model
        return settingsModel.findOne({ id: userId }, (err, setting) => {
            if (err) {
                return res.status(500).json(error("Can't find user's setting", res.statusCode))
            }

            // Get cardio log validations data
            return resistance_log_validationModel.find({}, (err, resistanceLogValidations) => {
                if (err) {
                    return res.status(500).json(error("Can't find cardio log validation data", res.statusCode))
                }

                return res.json(success("Success getting cardio log validations", resistanceLogValidations, res.statusCode));
            })
        })
    });
}