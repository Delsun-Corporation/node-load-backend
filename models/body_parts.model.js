const mongoose = require("mongoose");
const { commonLibrariesDataModel } = require("./libraries/common_libraries.model");

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
            type: String
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
                commonLibrariesDataModel
            ]
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("body_parts", bodyPartSchema);