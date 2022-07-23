const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model")
const _ = require("lodash");
const user_snoozeModel = require("../../models/user_snooze.model");

exports.getEditProfile = (req, res) => {
    const { id } = req.query;
    const { authorization } = req.headers;
    
    authModel.findOne({
        id
    }, (err, user) => {
        if (err || user == null || user == undefined) {
            return res.status(403).json(error("No user found with that ID", res.statusCode))
        }

        if (authorization != user.token) {
            return res.status(401).json(error("Unauthorized", res.statusCode))
        }

        delete user._doc["token"];
        delete user._doc["hashed_password"];
        delete user._doc["salt"];

        return user_snoozeModel.findOne({user_id: id}, (err, snooze) => {
            if (err || snooze == null || snooze == undefined) {
                return res.json(
                    success("Sign in Success", { ...user._doc }, res.statusCode)
                );
            }

            return res.json(success("Success getting user profile", { ...user._doc, user_snooze_detail: snooze}, res.statusCode));
        })
    })
}

exports.updateEditProfile = (req, res) => {
    const { authorization } = req.headers;
    const { id, name, email, country_code, mobile, date_of_birth, country_id, facebook, gender } = req.body;
    
    authModel.findOne({
        id
    }, (err, user) => {
        if (err || user == null || user == undefined) {
            return res.status(403).json(error("No user found with that ID", res.statusCode))
        }

        if (authorization != user.token) {
            return res.status(401).json(error("Unauthorized", res.statusCode))
        }

        const updatedData = {
            name, email, country_code, mobile, date_of_birth, country_id, facebook, gender
        }

        user = _.extend(user, updatedData);

        return user.save((err, result) => {
            if (err) {
                return res.status(403).json(error("Bad Request", res.statusCode))
            }

            return res.json(success("Success getting user profile", result, res.statusCode));
        })
    })
}