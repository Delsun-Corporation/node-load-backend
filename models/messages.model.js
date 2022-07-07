const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messagesSchema = new mongoose.Schema(
    {
        from_id: {
            type: String
        },
        conversation_id: {
            type: String
        },
        to_id: {
            type: String
        },
        message: {
            type: String
        },
        training_log_id: {
            type: String
        },
        event_id: {
            type: String
        },
        booked_client_id: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Messages", messagesSchema);