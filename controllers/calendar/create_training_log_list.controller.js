const { success, error } = require("../../helper/baseJsonResponse.js");
const validateToken = require("../../helper/token_checker");
const training_log_listModel = require("../../models/calendar/training_log_list.model.js");
const _ = require("lodash");

exports.createTrainingLog = (req, res) => {
  const {
    status,
    date,
    workout_name,
    training_goal_id,
    training_intensity_id,
    training_activity_id,
    targeted_hr,
    notes,
    is_saved_workout,
    exercise,
    training_goal_custom,
    training_goal_custom_id,
  } = req.body;

  validateToken(req, res, (user) => {
    const user_id = user.id;

    const updatedData = {
      status,
      date,
      workout_name,
      training_goal_id,
      training_intensity_id,
      training_activity_id,
      targeted_hr,
      notes,
      exercise,
      training_goal_custom,
      training_goal_custom_id,
      user_id,
    };

    const trainingLog = new training_log_listModel(updatedData);

    return trainingLog.save((err, log) => {
      if (err) {
        return res
          .status(500)
          .json(error("Erorr while create training log", res.statusCode));
      }

      return res.json(
        success("Success create training log", null, res.statusCode)
      );
    });
  });
};
