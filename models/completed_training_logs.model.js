const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const completedTrainingLogSchema = new mongoose.Schema(
    {
        exercise: {
            type: String
        },
        training_log_id: {
            type: String
        },
        is_complete: {
            type: Bool
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("CompletedTrainingLog", completedTrainingLogSchema);