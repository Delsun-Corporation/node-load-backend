const { error, success, validation } = require("../helper/baseJsonResponse");
const Account = require("../models/account.model")

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