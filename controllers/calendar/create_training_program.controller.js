const { success } = require("../../helper/baseJsonResponse");
const validateToken = require("../../helper/token_checker")

exports.createTrainingProgram = (req, res) => {
    validateToken(req, res, (user) => {
        const {
            status,
            type,
            user_id,
            training_frequencies_id,
            preset_training_programs_id,
            start_date,
            end_date,
            days
        } = req.body;
        
        return res.json(success("Success create cardio program", null, res.statusCode))
    })
}