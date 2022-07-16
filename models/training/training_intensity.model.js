const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingIntensitySchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        name: {
            type: String
        },
        code: {
            type: String
        },
        time_to_complete_1_rep_in_second: {
            type: Number
        },
        tempo: {
            type: Number
        },
        target_hr: {
            type: String
        },
        is_active: {
            type: Number
        },
        sequence: {
            type: Number
        },
        created_at: {
            type: String
        },
        updated_at: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("training_intensities", trainingIntensitySchema);