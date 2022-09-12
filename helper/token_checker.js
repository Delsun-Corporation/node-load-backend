const authModel = require("../models/auth.model");
const { error } = require("./baseJsonResponse");

// How to use
// const promise = validateToken(req);
// promise.then((user) => {
//   if (!user) {
//     res.status(403).json(error("Unauthorized", res.statusCode));
//   }

//   console.log("User Found with that ID");
//   res.json(success("Success", null, res.statusCode));
// });

async function validateToken(req, res, callback) {
  const { authorization } = req.headers;

  authModel.findOne({ token: authorization }, (err, user) => {
    if (err || user == null || user == undefined) {
        return res.status(403).json(error("Unauthorized", res.statusCode));
    }
    
    return callback(user);
  });
}

module.exports = validateToken;
