const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const credit_cardModel = require("../../models/credit_card.model");
const _ = require('lodash');

exports.createCreditCardList = (req, res) => {
    const { authorization } = req.headers;
    const {
        credit_card_number,
        name,
        expiry_date,
        cvv,
        address,
        country_name,
        city,
        state_province_region,
        postal_code,
    } = req.body;

    if (credit_card_number == null ||
        name == null ||
        expiry_date == null ||
        cvv == null ||
        address == null ||
        country_name == null ||
        city == null ||
        state_province_region == null ||
        postal_code == null) {
            return res.status(403).json(error("Invalid Request", res.statusCode));
        }

    if (authorization == null || authorization == undefined) {
        return res.status(401).json(error("Unauthorized", res.statusCode));
    }

    authModel.findOne({token: authorization}, (err, user) => {
        if (err) {
            return res.status(500).json(error("Something went wrong please try again", res.statusCode));
        }

        if (!user) {
            return res.status(401).json(error("Unauthorized", res.statusCode));
        }

        const userId = user.id;

        return credit_cardModel.find({user_id: userId}, (err, creditCards) => {
            if (err) {
                return res.status(500).json(error("Something went wrong please try again", res.statusCode));
            }

            var is_default = false;

            if (creditCards.length < 1) {
                is_default = true;
            }

            const creditCard = new credit_cardModel({
                credit_card_number,
                name,
                expiry_date,
                cvv,
                address,
                country_name,
                city,
                state_province_region,
                postal_code,
                is_default: is_default,
                user_id: userId
            });

            return creditCard.save((err, result) => {
                if (err) {
                    return res.status(500).json(error("Cannot create credit card, please try again", res.statusCode));
                }
        
                return res.json(success("Success create credit card", null, res.statusCode));
            })
        })
    })
}

exports.getCreditCardList = (req, res) => {
    const { authorization } = req.headers;
    
    authModel.findOne({token: authorization}, (err, user) => {
        if (err || !user) {
            return res.status(401).json(error("Unauthorized", res.statusCode));
        }

        const userId = user.id;

        return credit_cardModel.find({user_id: userId}, (err, credits) => {
            if (err) {
                return res.status(500).json(error("Can't find user's credit cards", res.statusCode));
            }

            return res.json(success("Success get all user credit cards", credits, res.statusCode));
        })
    })
}

exports.updateDefaultPaymentMethod = (req, res) => {
    const { authorization } = req.headers;
    const { id } = req.body;

    if (id == null || id == undefined || id == '') {
        return res.status(403).json(error("False request", res.statusCode));
    }

    authModel.findOne({token: authorization}, (err, user) => {
        if (err || !user) {
            return res.status(401).json(error("Unauthorized", res.statusCode));
        }
        return credit_cardModel.findById(id, (err, credit) => {
            if (err || !credit) {
                return res.status(500).json(error("Cannot find the credit card, please try again later", res.statusCode));
            }

            return credit_cardModel.findOne({is_default: true, user_id: user.id}, (err, defaultCredit) => {
                if (err || !defaultCredit) {
                    return res.status(500).json(error("Cannot find default credit card, please try again later", res.statusCode));
                }

                if (defaultCredit._id.toString() == credit._id.toString()) {
                    return res.json(success("Success save default credit card", null, res.statusCode));
                }

                const updateDefaultData = {
                    is_default: false
                }

                defaultCredit = _.extend(defaultCredit, updateDefaultData);

                return defaultCredit.save((err, result) => {
                    if (err) {
                        return res.status(500).json(error("Error updating default payment, please try again", res.statusCode));
                    }

                    const newDefaultData = {
                        is_default: true
                    }

                    credit = _.extend(credit, newDefaultData);

                    return credit.save((err, result) => {
                        if (err) {
                            return res.status(500).json(error("Error updating default payment, please try again", res.statusCode));
                        }

                        return res.json(success("Success save default credit card", null, res.statusCode));
                    })
                })
            })
        })
    })
}