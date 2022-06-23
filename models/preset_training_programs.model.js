const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const presetTrainingProgramsSchema = new mongoose.Schema(
    {
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
            type: Boolean
        },
        weeks: {
            type: Number
        }
    },
    {timestamps: true}
);