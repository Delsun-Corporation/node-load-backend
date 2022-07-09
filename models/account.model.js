const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true
        },
        code: {
            type: String
        },
        free_trial_days: {
            type: Number,
            default: 30
        },
        is_active: {
            type: Boolean,
            default: true
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Account", accountSchema);