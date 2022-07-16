const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const languagesSchema = new mongoose.Schema(
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
        is_active: {
            type: Number
        },
        create_at: {
            type: Date
        },
        update_at: {
            type: Date
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Languages", languagesSchema);