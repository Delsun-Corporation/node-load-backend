const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const availableTimesSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        name: String,
        code: {
            type: String
        },
        is_active: {
            type: Number
        },
        created_at: {
            type: Date
        },
        updated_at: {
            type: Date
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("available_times", availableTimesSchema);