const { error, success } = require("../../helper/baseJsonResponse");
const authModel = require("../../models/auth.model");
const credit_cardModel = require("../../models/credit_card.model");

exports.createCreditCardList = (req, res) => {
    const { authorization } = req.headers;
    const {
        credit_card_number,
        name,
        expiry_date,
        cvv,
        address,
        country_id,
        city,
        state_province_region,
        postal_code,
    } = req.body;

    if (credit_card_number == null ||
        name == null ||
        expiry_date == null ||
        cvv == null ||
        address == null ||
        country_id == null ||
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

            if (!creditCards) {
                is_default = true;
            }

            const creditCard = new credit_cardModel({
                credit_card_number,
                name,
                expiry_date,
                cvv,
                address,
                country_id,
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