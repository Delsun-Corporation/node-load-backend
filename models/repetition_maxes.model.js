const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const repetitionMaxesSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        code: {
            type: String
        },
        is_active: {
            type: Boolean
        },
        weight: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("RepetitionMaxes", repetitionMaxesSchema);