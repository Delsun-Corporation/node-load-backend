const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loadCenterRequestSchema = new mongoose.Schema(
    {
        user_id: {
            type: String
        },
        title: {
            type: String
        },
        start_date: {
            type: Date
        },
        birth_date: {
            type: String
        },
        yourself: {
            type: String
        },
        country_id: {
            type: String
        },
        specialization_ids: {
            type: String
        },
        training_type_ids: {
            type: String
        },
        experience_year: {
            type: String
        },
        rating: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("LoadCenterRequest", loadCenterRequestSchema);