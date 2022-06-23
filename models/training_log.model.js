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
        }
    },
    {timestamps: true}
);