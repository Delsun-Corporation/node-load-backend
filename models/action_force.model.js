const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const actionForceSchema = new mongoose.Schema(
    {
        id: Number,
        name: {
            type: String
        },
        code: {
            type: String
        },
        is_active: {
            type: Number
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("action_forces", actionForceSchema);