const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const settingsModel = require("../../models/settings.model");
const raceDistanceModel = require("../../models/race_distance.model");
const _ = require("lodash");
const training_activity_levelModel = require("../../models/training/physical_activity_levels.model");
const setting_training_unitsModel = require("../../models/training/setting_training_units.model");
const time_under_tensionModel = require("../../models/time_under_tension.model");

exports.getTrainingData = (req, res) => {
  const { authorization } = req.headers;
  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;
    const height = user.height;
    const weight = user.weight;

    return settingsModel.findOne(
      { user_id: id },
      "race_time race_distance_id hr_max hr_rest training_unit_ids run_auto_pause cycle_auto_pause is_hr_max_is_estimated training_physical_activity_level_ids vo2_max is_vo2_max_is_estimated bike_weight bike_wheel_diameter bike_front_chainwheel bike_rear_freewheel",
      (err, response) => {
        if (err) {
          return res
            .status(500)
            .json(
              error(
                "Cannot find user training's setting, please try again",
                res.statusCode
              )
            );
        }

        if (!response) {
          return res.json(
            success(
              "Success getting training's setting data",
              {
                weight,
                height,
              },
              res.statusCode
            )
          );
        }

        const _ids = response._doc.race_distance_id;

        return raceDistanceModel.findOne(
          { id: _ids },
          (err, race_distance_detail) => {
            return res.json(
              success(
                "Success getting training's setting data",
                {
                  race_distance_detail,
                  ...response._doc,
                  weight,
                  height,
                },
                res.statusCode
              )
            );
          }
        );
      }
    );
  });
};

exports.updateTrainingSettings = (req, res) => {
  const { authorization } = req.headers;

  const {
    height,
    race_time,
    race_distance_id,
    hr_max,
    hr_rest,
    weight,
    training_unit_ids,
    run_auto_pause,
    cycle_auto_pause,
    is_hr_max_is_estimated,
    training_physical_activity_level_ids,
    vo2_max,
    is_vo2_max_is_estimated,
    bike_weight,
    bike_wheel_diameter,
    bike_front_chainwheel,
    bike_rear_freewheel,
    time_under_tension,
  } = req.body;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    const updateData = {
      user_id: id,
      race_time,
      race_distance_id,
      hr_max,
      hr_rest,
      training_unit_ids,
      run_auto_pause,
      cycle_auto_pause,
      is_hr_max_is_estimated,
      training_physical_activity_level_ids,
      vo2_max,
      is_vo2_max_is_estimated,
      bike_weight,
      bike_wheel_diameter,
      bike_front_chainwheel,
      bike_rear_freewheel,
      time_under_tension,
    };

    const updatedUserData = {
      height,
      weight,
    };

    user = _.extend(user, updatedUserData);

    return user.save((err, result) => {
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

      return settingsModel.findOne({ user_id: id }, (err, setting) => {
        if (err || !setting) {
          console.log("Cannot Find setting model, create one instead");
          var setting = new settingsModel();

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

            const _ids = result._doc.race_distance_id;

            return raceDistanceModel.findOne(
              { id: _ids },
              (err, race_distance_detail) => {
                return res.json(
                  success(
                    "Success saving training's setting data",
                    {
                      race_distance_detail,
                      ...result._doc,
                    },
                    res.statusCode
                  )
                );
              }
            );
          });
        }

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

          const _ids = result._doc.race_distance_id;

          return raceDistanceModel.findOne(
            { id: _ids },
            (err, race_distance_detail) => {
              return res.json(
                success(
                  "Success saving training's setting data",
                  {
                    race_distance_detail,
                    ...result._doc,
                  },
                  res.statusCode
                )
              );
            }
          );
        });
      });
    });
  });
};

exports.getTrainingUnitsData = (req, res) => {
  const { authorization } = req.headers;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return settingsModel.findOne(
      { user_id: id },
      "training_unit_ids",
      (err, user) => {
        if (err) {
          return res
            .status(500)
            .json(
              error(
                "Cannot find user training's setting, please try again",
                res.statusCode
              )
            );
        }

        if (
          !user ||
          user.training_unit_ids == null ||
          user.training_unit_ids == undefined ||
          user.training_unit_ids == ""
        ) {
          return setting_training_unitsModel.find({}, (err, training_units) => {
            return res.json(
              success(
                "Success getting training's setting data",
                training_units,
                res.statusCode
              )
            );
          });
        }

        return setting_training_unitsModel.find({}, (err, training_units) => {
          if (!training_units) {
            return res
              .status(500)
              .json(
                error(
                  "Cannot find user training activity levels, please try again",
                  res.statusCode
                )
              );
          }

          training_units.forEach(function (units) {
            units.is_selected = units._id.toString() == user.training_unit_ids;
          });

          return res.json(
            success(
              "Success getting training's setting data",
              training_units,
              res.statusCode
            )
          );
        });
      }
    );
  });
};

exports.getTrainingPhysicalLevelData = (req, res) => {
  const { authorization } = req.headers;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return settingsModel.findOne(
      { user_id: id },
      "training_physical_activity_level_ids",
      (err, user) => {
        if (err) {
          return res
            .status(500)
            .json(
              error(
                "Cannot find user training's setting, please try again",
                res.statusCode
              )
            );
        }

        if (
          !user ||
          user.training_physical_activity_level_ids == null ||
          user.training_physical_activity_level_ids == undefined ||
          user.training_physical_activity_level_ids == ""
        ) {
          return training_activity_levelModel.find(
            {},
            (err, training_activity_levels) => {
              return res.json(
                success(
                  "Success getting training's setting data",
                  training_activity_levels,
                  res.statusCode
                )
              );
            }
          );
        }

        return training_activity_levelModel.find(
          {},
          (err, training_activity_levels) => {
            if (!training_activity_levels) {
              return res
                .status(500)
                .json(
                  error(
                    "Cannot find user training activity levels, please try again",
                    res.statusCode
                  )
                );
            }

            training_activity_levels.forEach(function (level) {
              level.is_selected =
                level._id.toString() ==
                user.training_physical_activity_level_ids;
            });

            return res.json(
              success(
                "Success getting training's setting data",
                training_activity_levels,
                res.statusCode
              )
            );
          }
        );
      }
    );
  });
};

exports.getTrainingTimeUnderTension = (req, res) => {
  const { authorization } = req.headers;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return settingsModel.findOne(
      { user_id: id },
      "time_under_tension",
      (err, user) => {
        if (err) {
          return res
            .status(500)
            .json(
              error(
                "Cannot find user training's setting, please try again",
                res.statusCode
              )
            );
        }

        if (
          !user ||
          user.time_under_tension == null ||
          user.time_under_tension == undefined
        ) {
          return time_under_tensionModel.find({}, (err, time_under_tension) => {
            return res.json(
              success(
                "Success getting time under tension's setting data",
                time_under_tension,
                res.statusCode
              )
            );
          });
        }

        return time_under_tensionModel.find({}, (err, time_under_tension) => {
          if (!time_under_tension) {
            return res
              .status(500)
              .json(
                error(
                  "Cannot find user training time under tension data, please try again",
                  res.statusCode
                )
              );
          }

          time_under_tension.forEach(function (time) {
            user.time_under_tension.forEach(function (user_time) {
              if (user_time.id == time._id.toString()) {
                if (
                  time.user_updated_tempo != null ||
                  time.user_updated_tempo != undefined ||
                  time.user_updated_tempo != []
                ) {
                  time.user_updated_tempo = user_time.user_updated_tempo;
                }
              }
            });
          });

          return res.json(
            success(
              "Success getting time under tension's setting data",
              time_under_tension,
              res.statusCode
            )
          );
        });
      }
    );
  });
};
