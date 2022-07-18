const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bodyPartSchema = new mongoose.Schema(
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
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("body_parts", bodyPartSchema);