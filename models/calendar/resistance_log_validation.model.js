const mongoose = require("mongoose");

const LogResistanceValidationSchema = new mongoose.Schema(
    {
        training_intensity_id: Number,
        training_goal_id: Number,
        weight_range: String,
        reps_range: String,
        reps_time_range: String,
        duration_range: String,
        rest_range: String
    },
    {timestamps: true}
);

module.exports = mongoose.model("log_resistance_validations", LogResistanceValidationSchema);