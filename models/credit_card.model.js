const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const creditCardSchema = new mongoose.Schema(
    {
        user_id: Number,
        credit_card_number: String,
        name: String,
        expiry_date: Date,
        cvv: String,
        address: String,
        country_name: String,
        city: String,
        state_province_region: String,
        postal_code: String,
        is_default: Boolean
    },
    {timestamps: true}
);

module.exports = mongoose.model("credit_card", creditCardSchema);