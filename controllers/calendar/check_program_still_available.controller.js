const { success } = require("../../helper/baseJsonResponse")
const validateToken = require("../../helper/token_checker")

exports.checkProgramIsAvailable = (req, res) => {
    validateToken(req, res, (user) => {
        return res.json(success("Success check program is available", null, res.statusCode));
    })
}