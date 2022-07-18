const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const professionalScheduleSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        description: {
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

module.exports = mongoose.model("professional_schedules", professionalScheduleSchema);