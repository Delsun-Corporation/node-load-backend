const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const savedWorkoutsSchema = new mongoose.Schema(
    {
        training_log_id: {
            type: String
        },
        user_id: {
            type: String
        }
    },
    {timestamps: true}
);