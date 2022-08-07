const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeUnderTensionSchema = new mongoose.Schema(
    {
        intensity: String,
        description: String,
        tempo: String,
        user_updated_tempo: String
    },
    {timestamps: true}
);

module.exports = mongoose.model("time_under_tension", timeUnderTensionSchema);