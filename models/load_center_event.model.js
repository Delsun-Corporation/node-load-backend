const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loadCentreEventSchema = new mongoose.Schema(
    {
        user_id: {
            type: String
        },
        event_type_ids: {
            type: String
        },
        visible_to: {
            type: String
        },
        max_guests: {
            type: Number
        },
        event_name: {
            type: String
        },
        event_price: {
            type: String
        },
        currency_id: {
            type: String
        },
        event_image: {
            type: String
        },
        date_time: {
            type: Date
        },
        earlier_time: {
            type: Number
        },
        duration: {
            type: Number
        },
        location: {
            type: String
        },
        latitude: {
            type: String
        },
        longtitude: {
            type: String
        },
        description: {
            type: String
        },
        amenities_available: {
            type: String
        },
        is_completed: {
            type: Boolean
        },
        cancellation_policy_id: {
            type: Number
        },
        general_rules: {
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("LoadCentreEvent", loadCentreEventSchema);