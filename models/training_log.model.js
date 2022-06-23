const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: String
        },
        status: {
            type: String
        },
        workout_name: {
            type: String
        },
        training_goal_id: {
            type: String
        },
        training_goal_custom_id: {
            type: String
        },
        training_goal_custom: {
            type: String
        },
        training_intensity_id: {
            type: String
        },
        training_activity_id: {
            type: String
        },
        user_own_review: {
            type: String
        },
        notes: {
            type: String
        },
        exercise: {
            type: String
        },
        is_log: {
            type: Boolean
        },
        latitude: {
            type: String
        },
        longtitude: {
            type: String
        },
        comments: {
            type: String
        },
        is_complete: {
            type: Boolean
        }
    },
    {timestamps: true}
);