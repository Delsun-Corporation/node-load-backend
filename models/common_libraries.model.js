const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commonLibrariesSchema = new mongoose.Schema(
    {
        id: {
            type: String
        },
        exercise_name: {
            type: String
        },
        category_id: {
            type: String
        },
        sub_header_id: {
            type: String
        },
        body_image_type: {
            type: Number
        },
        regions_ids: {
            type: String
        },
        regions_secondary_ids: {
            type: String
        },
        motion: String,
        movement: String,
        mechanics_id: String,
        targeted_muscles_ids: {
            type: String
        },
        action_force_id: String,
        equipment_ids: {
            type: String
        },
        exercise_link: {
            type: String
        },
        is_favorite: String,
        created_at: {
            type: Date
        },
        updated_at: {
            type: Date
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("common_libraries", commonLibrariesSchema);