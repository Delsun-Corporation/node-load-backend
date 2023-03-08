const { error, success } = require("../../helper/baseJsonResponse")
const validateToken = require("../../helper/token_checker")
const authModel = require("../../models/auth.model")
const training_log_listModel = require("../../models/calendar/training_log_list.model");
const training_goalModel = require("../../models/training/training_goal.model");
const training_intensityModel = require("../../models/training/training_intensity.model");
const training_programsModel = require("../../models/training/training_programs.model");
const ObjectId = require('mongoose').Types.ObjectId;

// return training log list
// return training log program too
exports.getTrainingLogList = (req, res) => {
    validateToken(req, res, (user) => {
        const user_id = user.id;
        training_log_listModel.find({user_id: user_id}, (err, trainingLogs) => {
            if (err) {
                return res.status(500).json(error("Error find training log list", res.statusCode))
            }

            training_programsModel.find({user_id: user_id}, (err, trainingPrograms) => {
                if (err) {
                    return res.status(500).json(error("Error find training program list", res.statusCode))
                }

                return res.json(success("Success getting training log list", { 
                    training_log_list: trainingLogs, 
                    training_program_list: trainingPrograms }, res.statusCode))
            })
        })
    })
}

exports.getTrainingLogDetail = (req, res) => {
    validateToken(req, res, (user) => {
        const user_id = user.id;
        const trainingId = req.params.trainingId;
        training_log_listModel.findById(trainingId, (err, trainingLog) => {
            if (err || trainingLog == null) {
                return res.status(500).json(error("Error find training log detail", res.statusCode))
            }
            const trainingGoalId = trainingLog.training_goal_id
            training_goalModel.findOne({id: trainingGoalId}, (err, training_goal) => {
                if (err || training_goal == null) {
                    return res.status(500).json(error("Error find training goal", res.statusCode))
                }

                training_intensityModel.findOne({id: trainingLog.training_intensity_id}, (err, training_intensity) => {
                    if (err || training_goal == null) {
                        return res.status(500).json(error("Error find training goal", res.statusCode))
                    }

                    return res.json(success("Success getting training log detail", { ...trainingLog._doc, training_goal, training_intensity, user_detail: user }, res.statusCode))
                })
            })
        })
    })
}