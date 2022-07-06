const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customTrainingProgramSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        code: {
            type: String
        },
        is_active: {
            type: Boolean
        },
        parent_id: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("CustomTrainingProgram", customTrainingProgramSchema);