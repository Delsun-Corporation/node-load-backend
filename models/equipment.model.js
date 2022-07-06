const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        code: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Equipment", equipmentSchema);