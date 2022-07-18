const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingActivitiesSchema = new mongoose.Schema(
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
        icon_path: {
            type: String
        },
        icon_path_red: {
            type: String
        },
        icon_path_white: {
            type: String
        },
        is_active: {
            type: Number
        },
        sequence: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("training_activities", trainingActivitiesSchema);