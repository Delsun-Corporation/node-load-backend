const { error, success } = require("../../helper/baseJsonResponse");
const validateToken = require("../../helper/token_checker");
const training_log_listModel = require("../../models/calendar/training_log_list.model");

exports.deleteTrainingLog = ((req, res) => {
    validateToken(req, res, (user) => {
        const trainingId = req.params.trainingId;

        training_log_listModel.findByIdAndDelete(trainingId, (err, response) => {
            if (err) {
                return res.status(500).json(error("Failed to delete training log", res.statusCode));
            }

            return res.json(success("Success delete training log", null, res.statusCode));
        })
    })
})