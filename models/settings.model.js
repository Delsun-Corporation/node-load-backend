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
    is_auto_accept: Boolean,
    cancellation_policy_id: Number,
    rate: String,
    per_multiple_session_rate: Number,
    professional_type_id: Number,
    location_name: String,
    languages_written_ids: [String],
    professional_specialization_ids: [String],
    currency_id: Number,
    amenities: [String],
    professional_language_id: Number,
    experience_and_achievements: String,
    general_rules: String,
    per_session_rates: Number,
    terms_of_service: String,
    academic_and_certifications: String,
    introduction: String,
    session_duration: String,
    payment_option_id: String,
    days: [String],
    session_maximum_clients: Number,
    basic_requirements: String,
    profession: String,
    is_form: Boolean,
    is_answered: Boolean,
    is_auto_form: Boolean,
    is_custom: Boolean,
    professional_type_id: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingsSchema);
