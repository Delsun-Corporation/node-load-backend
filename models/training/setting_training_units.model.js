const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingUnitsSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        is_selected: {
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("setting_training_units", trainingUnitsSchema);