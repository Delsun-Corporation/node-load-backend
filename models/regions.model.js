const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const regionsSchema = new mongoose.Schema(
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
        is_active: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("regions", regionsSchema);