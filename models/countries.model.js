const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countriesSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
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
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("countries", countriesSchema);