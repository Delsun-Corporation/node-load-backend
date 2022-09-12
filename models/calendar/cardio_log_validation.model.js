const mongoose = require("mongoose");

const cardioLogValidationSchema = new mongoose.Schema(
    {
        training_activity_id: Number,
        training_goal_id: Number,
        distance_range: String,
        duration_range: String,
        speed_range: String,
        pace_range: String,
        percentage_range: String,
        rest_range: String,
        is_active: Boolean, 
        watt_range: String,
        rpm_range: String,
        lvl_range: String,
        hr_max: Number
    },
    {timestamps: true}
);

module.exports = mongoose.model("log_cardio_validations", cardioLogValidationSchema);