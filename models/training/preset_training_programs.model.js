// Split jadi 2 ndek cardio sama resistance

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const presetTrainingProgramsSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        title: {
            type: String
        },
        code: {
            type: String
        },
        subtitle: {
            type: String
        },
        status: {
            type: String
        },
        type: {
            type: String
        },
        is_active: {
            type: Number
        },
        weeks: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("preset_training_programs", presetTrainingProgramsSchema);