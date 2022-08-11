const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userLibrariesSchema = new mongoose.Schema(
    {
        favorite_libraries: {
            type: [Number]
        },
        user_id: {
            type: Number
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("user_libraries", userLibrariesSchema);