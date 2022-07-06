const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionsSchema = new mongoose.Schema(
    {
        user_id: {
            type: String
        },
        status: {
            type: String
        },
        name: {
            type: String
        },
        type: {
            type: String
        },
        intensity: {
            type: String
        },
        fess: {
            type: String
        },
        professional_name: {
            type: String
        },
        session_id: String
    },
    {timestamps: true}
);

module.exports = mongoose.model("Session", sessionsSchema);