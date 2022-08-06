const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingActivitySchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        is_selected: {
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("physical_activity_levels", trainingActivitySchema);