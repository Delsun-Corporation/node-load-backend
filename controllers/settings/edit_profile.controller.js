const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model")
const _ = require("lodash");

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

        return res.json(success("Success getting user profile", user, res.statusCode));
    })
}

exports.updateEditProfile = (req, res) => {
    const { authorization } = req.headers;
    const { id, name, email, country_code, mobile, date_of_birth, country_id, facebook } = req.body;
    
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
            name, email, country_code, mobile, date_of_birth, country_id, facebook
        }

        user = _.extend(user, updatedData);

        return user.save((err, result) => {
            if (err) {
                return res.status(500).json(error("Error saving user profile, please try again later", res.statusCode))
            }

            return res.json(success("Success getting user profile", result, res.statusCode));
        })
    })
}