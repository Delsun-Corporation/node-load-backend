const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingsSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
    },
    about: String,
    specialization_ids: [Number],
    language_id: Number,
    is_auto_topup: Boolean,
    auto_topup_amount: Number,
    minimum_balance: String,
    is_card_default: Boolean,
    credit_card_id: String,
    premium_profile_permission: String,
    feed_permission: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingsSchema);
