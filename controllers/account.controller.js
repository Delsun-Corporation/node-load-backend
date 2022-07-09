const { error, success, validation } = require("../helper/baseJsonResponse");
const Account = require("../models/account.model");
const User = require("../models/auth.model");
const _ = require("lodash");
const Snooze = require("../models/user_snooze.model");

exports.addAccountType = (req, res) => {
    const { name } = req.body;

    if (name === "" || name != null) {
        return res.status(422).json(validation(null));
    }

    const account = new Account({
        name,
        code: name.toUpperCase()
    })

    return account.save((err, account) => {
        if (err) {
            return res.status(500).json(error("Error create new account", res.statusCode));
        }

        return res.json(success("Succes Create new Account", null, res.statusCode));
    })
}

exports.updateAccountType = (req, res) => {
    const { account_id } = req.body;
    const { authorization } = req.headers;

    Account.findById(account_id, (err, result) => {
        if (err || !result) {
            return res.status(401).json(error("No Account Found with that ID", res.statusCode));
        }

        User.findOne({
            token: authorization
        }, (err, user) => {
            if (err || !user) {
                return res.status(401).json(error("Unauthorized", res.statusCode));
            }
    
            const updateAccountId = {
                account_id
            }
      
            user = _.extend(user, updateAccountId);
            
            return user.save((err, result) => {
                if (err) {
                    return res
                      .status(500)
                      .json(error("Error update account type", res.statusCode));
                }
    
                return res.json(success("Success update account type", null, res.statusCode));
            })
        })
    })

}

exports.updateAccountSnooze = (req, res) => {
    const { is_snooze, start_date, end_date } = req.body;
    const { authorization } = req.headers;

    if (is_snooze == null || start_date == null || end_date == null) {
        return res.status(403).json(error("Error Request Body", res.statusCode));
    }

    User.findOne({
        token: authorization
    }, (err, user) => {
        if (err || !user) {
            return res.status(401).json(error("Unauthorized", res.statusCode));
        }

        const updateData = {
            is_snooze
        }
  
        user = _.extend(user, updateData);
        
        return user.save((err, result) => {
            if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json(error("Error update account type", res.statusCode));
            }

            Snooze.findOne({
                user_id: result.id
            }, (err, model) => {
                console.log(model);
                if (err) {
                    return res
                      .status(500)
                      .json(error("Cannot find snooze model with that user id", res.statusCode));
                }

                if (!model) {
                    const snooze = new Snooze({
                        start_date,
                        end_date,
                        user_id: result.id
                    })
                    
                    return snooze.save((err, snooze) => {
                        if (err) {
                            return res
                          .status(500)
                          .json(error("Error while saving Snooze", res.statusCode));
                        }

                        return res.json(success("Success update account snooze", null, res.statusCode)); 
                    })
                }

                const updateData = {
                    start_date,
                    end_date
                }
    
                model = _.extend(model, updateData);

                return model.save((err, result) => {
                    if (err) {
                        return res
                          .status(500)
                          .json(error("Error while saving Snooze", res.statusCode));
                    }

                    return res.json(success("Success update account type", null, res.statusCode));
                })
            })
        })
    })
}