const { error, success } = require("../../helper/baseJsonResponse")
const validateToken = require("../../helper/token_checker")
const authModel = require("../../models/auth.model")
const training_log_listModel = require("../../models/calendar/training_log_list.model")

// return training log list
// return training log program too
exports.getTrainingLogList = (req, res) => {
    validateToken(req, res, (user) => {
        const user_id = user.id;
        training_log_listModel.find({user_id: user_id}, (err, trainingLogs) => {
            if (err) {
                return res.status(500).json(error("Error find training log list", res.statusCode))
            }

            return res.json(success("Success getting training log list", { training_log_list: trainingLogs }, res.statusCode))
        })
    })
}