const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        message: {
            type: String
        },
        read_at: {
            type: Date
        },
        body: {
            type: String
        },
        user_id: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Notification", notificationSchema);