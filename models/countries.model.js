const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countriesSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        code: {
            type: String
        },
        country_code: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Countries", countriesSchema);