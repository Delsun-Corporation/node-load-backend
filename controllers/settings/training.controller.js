const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const settingsModel = require("../../models/settings.model");
const raceDistanceModel = require("../../models/race_distance.model");
const _ = require("lodash");

exports.getTrainingData = (req, res) => {
  const { authorization } = req.headers;
  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    return settingsModel.findOne(
      { user_id: id },
      "height race_time race_distance_id hr_max hr_rest weight training_unit_ids run_auto_pause cycle_auto_pause is_hr_max_is_estimated training_physical_activity_level_ids vo2_max is_vo2_max_is_estimated bike_weight bike_wheel_diameter bike_front_chainwheel bike_rear_freewheel",
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
              null,
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
    bike_rear_freewheel
  } = req.body;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || !user) {
      return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    const id = user.id;

    const updateData = {
        user_id: id,
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
        bike_rear_freewheel
      };

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
                "Success getting training's setting data",
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
                "Success getting training's setting data",
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
          "units",
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
                  null,
                  res.statusCode
                )
              );
            }

            return res.json(
                success(
                  "Success getting training's setting data",
                  {
                    ...response._doc,
                  },
                  res.statusCode
                )
              );
          }
        );
      });
}
