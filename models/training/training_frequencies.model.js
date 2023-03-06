const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingFrequenciesSchema = new mongoose.Schema(
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
        max_days: {
            type: Number
        },
        preset_training_program_ids: {
            type: [String]
        },
        is_active: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("training_frequencies", trainingFrequenciesSchema);