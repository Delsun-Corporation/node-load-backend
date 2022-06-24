const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingProgramsSchema = new mongoose.Schema(
    {
        status: {
            type: String
        },
        type: {
            type: String
        },
        preset_training_program_id: {
            type: String
        },
        training_frequencies_id: {
            type: String
        },
        start_date: {
            type: Date
        },
        end_date: {
            type: Date
        },
        by_date: {
            type: String
        },
        days: {
            type: String
        },
        date: {
            type: Date
        },
        phases: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Training_Program", trainingProgramsSchema);