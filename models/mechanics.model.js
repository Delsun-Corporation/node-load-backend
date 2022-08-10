const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mechanicsSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Mechanics", mechanicsSchema);