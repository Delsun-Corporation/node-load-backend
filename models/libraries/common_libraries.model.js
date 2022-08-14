const mongoose = require("mongoose");
const { repetitionMaxDetailObject } = require("./custom/libraries_custom_object.model");

const Schema = mongoose.Schema;

exports.commonLibrariesDataModel = {
    id: {
        type: Number
    },
    exercise_name: {
        type: String
    },
    category_id: {
        type: Number
    },
    sub_header_id: {
        type: Number
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
    mechanics_id: Number,
    targeted_muscles_ids: {
        type: String
    },
    action_force_id: Number,
    equipment_ids: {
        type: String
    },
    exercise_link: {
        type: String
    },
    is_favorite: Number,
    is_active: Number,
    repetition_max: {
        type: [
            repetitionMaxDetailObject
        ]
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
}

const commonLibrariesSchema = new mongoose.Schema(
    this.commonLibrariesDataModel,
    {timestamps: true}
);

module.exports = mongoose.model("common_libraries", commonLibrariesSchema);