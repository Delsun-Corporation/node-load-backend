const { success, error } = require("../../helper/baseJsonResponse")
const validateToken = require("../../helper/token_checker")
const training_program_checkModel = require("../../models/calendar/training_program_check.model")

exports.checkTrainingProgram = (req, res) => {
    validateToken(req, res, (user) => {
        return training_program_checkModel.findOne({user_id: user.id}, (err, checkModel) => {
            // if error send error json
            if (err) {
                return res.status(500).json(error("Error get training program check", res.statusCode));
            }

            // if not found, create new model in database
            if (checkModel == null || checkModel == undefined) {
                const checkModel = new training_program_checkModel();
                checkModel.user_id = user.id
                return checkModel.save((err, result) => {
                    if (err) {
                        return res.status(500).json(error("Error save training program check", res.statusCode));
                    }
                    console.log(result);
                    return res.json(success("Success get training program check", result, res.statusCode));
                });
            }

            // If found, return in to user
            console.log(checkModel);
            return res.json(success("Success get training program checker", checkModel, res.statusCode));
        })
    })
}