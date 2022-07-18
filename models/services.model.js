const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const servicesSchema = new mongoose.Schema(
    {
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

module.exports = mongoose.model("services", servicesSchema);