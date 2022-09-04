const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingGoalSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        name: {
            type: String
        },
        target_hr: {
            type: String
        },
        training_activity_ids: {
            type: String
        },
        training_intensity_ids: {
            type: String
        },
        display_at: {
            type: String
        },
        code: {
            type: String
        },
        is_active: {
            type: String
        },
        sequence: {
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

module.exports = mongoose.model("training_goal", trainingGoalSchema);