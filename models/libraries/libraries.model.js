const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const librariesSchema = new mongoose.Schema(
    {
        exercise_name: {
            type: String
        },
        user_id: {
            type: String
        },
        category_id: {
            type: String
        },
        regions_ids: {
            type: [String]
        },
        mechanic_id: {
            type: String
        },
        targeted_muscles_id: {
            type: String
        },
        action_force_id: {
            type: String
        },
        equipment_id: {
            type: String
        },
        repetition_max: {
            type: String
        },
        exercise_link: {
            type: String
        },
        is_favorite: {
            type: Boolean
        },
        is_active: {
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("libraries", librariesSchema);