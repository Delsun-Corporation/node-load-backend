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
    per_multiple_session_rate: String,
    professional_type_id: Number,
    location_name: String,
    languages_written_ids: [Number],
    professional_specialization_ids: [Number],
    currency_id: Number,
    amenities: [String],
    professional_language_id: [Number],
    experience_and_achievements: String,
    general_rules: String,
    per_session_rate: String,
    terms_of_service: String,
    academic_and_certifications: String,
    introduction: String,
    session_duration: String,
    payment_option_id: String,
    days: [
      {
        title: String,
        selected: Boolean,
        data: [
          {
            name: String,
            break: String,
            selected_day: Boolean,
            openning_hours: String
          }
        ]
      }
    ],
    session_maximum_clients: Number,
    basic_requirement: String,
    profession: String,
    is_form_auto_send: Boolean,
    is_form_compulsary: Boolean,
    is_form_agree: Boolean,
    is_answered: Boolean,
    is_auto_form: Boolean,
    is_custom: Boolean,
    professional_type_id: Number,
    latitude: Number,
    longitude: Number,
    session_per_package: Number,
    academic_credentials: [
      {
        AwardingInstitution: String,
        CourseOfStudy: String,
      },
    ],
    schedule_management: {
      allow_advance_booking: Boolean,
      time_in_advance_id: Number,
      is_schedule_auto_accept: Boolean
    },

    // Training Data
    height: Number,
    race_time: String,
    race_distance_id: Number,
    hr_max: Number,
    hr_rest: Number,
    weight: Number,
    training_unit_ids: [String],
    run_auto_pause: Boolean,
    cycle_auto_pause: Boolean,
    is_hr_max_is_estimated: Boolean,
    training_physical_activity_level_ids: Number,
    vo2_max: Number,
    is_vo2_max_is_estimated: Boolean,
    bike_weight: Number,
    bike_wheel_diameter: Number,
    bike_front_chainwheel: Number,
    bike_rear_freewheel: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingsSchema);
