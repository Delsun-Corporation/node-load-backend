const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const equipmentSchema = new mongoose.Schema(
    {
        id: Number,
        name: {
            type: String
        },
        code: {
            type: String
        },
        is_active: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("equipments", equipmentSchema);