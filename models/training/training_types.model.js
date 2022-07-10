const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingTypesSchema = new mongoose.Schema(
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
        is_active: {
            type: Number
        },
        sequence: {
            type: Number
        },
        created_at: {
            type: Date
        },
        updated_at: {
            type: Date
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("training_types", trainingTypesSchema);