const { error, success, validation } = require("../helper/baseJsonResponse");
const Account = require("../models/account.model");
const User = require("../models/auth.model");
const _ = require("lodash");

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
        if (err) {
            return res.status(401).json(error("No Account Found with that ID", res.statusCode));
        }

        User.findOne({
            token: authorization
        }, (err, user) => {
            if (err) {
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