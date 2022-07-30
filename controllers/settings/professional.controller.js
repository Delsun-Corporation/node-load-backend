const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const settingsModel = require("../../models/settings.model");
const _ = require("lodash");

exports.getProfessionalData = (req, res) => {
    const { authorization } = req.headers;

    authModel.findOne({ token: authorization }, (err, user) => {
        if (err || !user) {
          return res.status(401).json(error("Unauthorized", res.statusCode));
        }
    
        const id = user.id;
    
        return settingsModel.findOne({user_id: id}, 'is_custom is_auto_accept cancellation_policy_id rate per_multiple_session_rate professional_type_id location_name languages_written_ids professional_specialization_ids currency_id amenities professional_language_id experience_and_achievements general_rules per_session_rates terms_of_service academic_and_certifications introduction session_duration payment_option_id days session_maximum_clients basic_requirements profession is_form is_answered is_auto_form professional_type_id', 
        (err, response) => {
            if (err) {
                return res.status(500).json(error("Cannot find user professional's setting, please try again", res.statusCode))
            }

            if (!response) {
                return res.json(success("Success getting professional's setting data", null, res.statusCode));
            }
            
            return res.json(success("Success getting professional's setting data", { ...response._doc }, res.statusCode));
        })
      });
}

exports.updateProfessionalSettings = (req, res) => {
    const { authorization } = req.headers;
    const {
        profession,
        introduction,
        rate,
        specialization_ids,
        experience_and_achievements,
        languages_spoken_ids,
        languages_written_ids,
        session_duration,
        professional_type_id,
        session_maximum_clients,
        basic_requirement,
        amenities,
        payment_option_id,
        per_session_rate,
        per_multiple_session_rate,
        is_custom,
        days,
        is_auto_accept,
        latitude,
        longitude,
        location_name,
        academic_credentials,
        is_forms,
        is_answered
    } = req.body;
  
    authModel.findOne({ token: authorization }, (err, user) => {
      if (err || !user) {
        return res.status(401).json(error("Unauthorized", res.statusCode));
      }
  
      const id = user.id;
  
      return settingsModel.findOne({ user_id: id }, (err, setting) => {
        if (err || !setting) {
          console.log("Cannot Find setting model, create one instead");
          var setting = new settingsModel();
          const updateData = {
            user_id: id,
            profession,
            introduction,
            rate,
            professional_specialization_ids: specialization_ids,
            experience_and_achievements,
            professional_language_id: languages_spoken_ids,
            languages_written_ids,
            session_duration,
            professional_type_id,
            session_maximum_clients,
            basic_requirement,
            amenities,
            payment_option_id,
            per_session_rate,
            per_multiple_session_rate,
            is_custom,
            days,
            is_auto_accept,
            latitude,
            longitude,
            location_name,
            academic_credentials,
            is_forms,
            is_answered
        };
  
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
  
            return res.json(
              success("Success saving user professional setting", null, res.statusCode)
            );
          });
        }
  
        const updateData = {
            user_id: id,
            profession,
            introduction,
            rate,
            professional_specialization_ids: specialization_ids,
            experience_and_achievements,
            professional_language_id: languages_spoken_ids,
            languages_written_ids,
            session_duration,
            professional_type_id,
            session_maximum_clients,
            basic_requirement,
            amenities,
            payment_option_id,
            per_session_rate,
            per_multiple_session_rate,
            is_custom,
            days,
            is_auto_accept,
            latitude,
            longitude,
            location_name,
            academic_credentials,
            is_forms,
            is_answered
        };
  
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
  
          return res.json(
            success("Success saving user professional setting", null, res.statusCode)
          );
        });
      });
    });
  };