const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingFrequenciesSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        code: {
            type: String
        },
        max_days: {
            type: Number
        },
        preset_training_programid: {
            type: String
        },
        is_active: {
            type: Boolean
        },
        weeks: {
            type: Number
        }
    },
    {timestamps: true}
);