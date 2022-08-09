const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bodyPartSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        parent_id: {
            type: Number
        },
        name: {
            type: String
        },
        code: {
            type: String
        },
        type: {
            type: String
        },
        image: {
            type: String
        },
        diplay_id: {
            type: String
        },
        is_region: {
            type: Boolean
        },
        image: {
            type: String
        },
        secondary_image: {
            type: String
        },
        sequence: {
            type: Number
        },
        is_active: {
            type: String
        },
        data: {
            type: [
                {
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
                    is_favorite: Number,
                    created_at: {
                        type: Date
                    },
                    updated_at: {
                        type: Date
                    }
                }
            ]
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("body_parts", bodyPartSchema);