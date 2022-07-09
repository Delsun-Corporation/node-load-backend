const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSnoozeSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number
        },
        start_date: {
            type: Date
        },
        end_date: {
            type: Date
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("UserSnooze", userSnoozeSchema);