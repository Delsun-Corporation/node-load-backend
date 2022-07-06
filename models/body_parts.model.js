const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bodyPartSchema = new mongoose.Schema(
    {
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
        sequence: {
            type: Number
        },
        is_active: {
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("BodyPart", bodyPartSchema);