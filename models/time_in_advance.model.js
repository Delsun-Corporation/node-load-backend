const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeInAdvanceSchema = new mongoose.Schema(
    {
        is_active: Boolean,
        name: String,
        code: String
    },
    {timestamps: true}
);

module.exports = mongoose.model("time_in_advances", timeInAdvanceSchema);