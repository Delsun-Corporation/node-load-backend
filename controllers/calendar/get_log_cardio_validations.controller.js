const { error, success } = require("../../helper/baseJsonResponse");
const validateToken = require("../../helper/token_checker");
const cardio_log_validationModel = require("../../models/calendar/cardio_log_validation.model");
const settingsModel = require("../../models/settings.model");

exports.getLogCardioValidation = (req, res) => {
    validateToken(req, res, (user) => {
        const userId = user.id;

        // Get hr max from setting model
        return settingsModel.findOne({ id: userId }, (err, setting) => {
            if (err) {
                return res.status(500).json(error("Can't find user's setting", res.statusCode))
            }

            const hr_max = setting.hr_max;

            // Get cardio log validations data
            return cardio_log_validationModel.find({}, (err, cardioLogValidations) => {
                if (err) {
                    return res.status(500).json(error("Can't find cardio log validation data", res.statusCode))
                }

                cardioLogValidations.forEach(element => {
                    element.hr_max = hr_max;
                });

                return res.json(success("Success getting cardio log validations", {cardioLogValidations}, res.statusCode));
            })
        })
    });
}