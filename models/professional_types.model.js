const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const professionalTypesSchema = new mongoose.Schema(
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
        description: {
            type: String
        },
        is_active: {
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

module.exports = mongoose.model("professional_types", professionalTypesSchema);