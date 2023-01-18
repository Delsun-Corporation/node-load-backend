const mongoose = require("mongoose");

const LogResistanceValidationSchema = new mongoose.Schema(
    {
        is_active: Boolean,
        name: String
    },
    {timestamps: true}
);

module.exports = mongoose.model("swimming_styles", LogResistanceValidationSchema);