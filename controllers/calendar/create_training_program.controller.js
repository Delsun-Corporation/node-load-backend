const { success, error } = require("../../helper/baseJsonResponse");
const validateToken = require("../../helper/token_checker");
const training_programsModel = require("../../models/training/training_programs.model");

exports.createTrainingProgram = (req, res) => {
    validateToken(req, res, (user) => {
        const {
            status,
            type,
            training_frequencies_id,
            preset_training_programs_id,
            start_date,
            end_date,
            days
        } = req.body;

        const updatedData = {
            status,
            type,
            training_frequencies_id,
            preset_training_programs_id,
            start_date,
            end_date,
            days,
            user_id: user.id
        }

        const trainingProgram = new training_programsModel(updatedData);

        return trainingProgram.save((err, response) => {
            if (err) {
                return res
                  .status(500)
                  .json(error("Error while create training program", res.statusCode));
            }
            return res.json(success("Success create training program", null, res.statusCode))
        })
    })
}