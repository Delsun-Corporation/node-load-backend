const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trainingProgramCheckSchema = new mongoose.Schema(
  {
    is_resistance_custom_edit: {
        type: Boolean,
        default: false
    },
    is_resistance_preset_delete: {
        type: Boolean,
        default: false
    },
    is_cardio_custom_edit: {
        type: Boolean,
        default: false
    },
    is_cardio_preset_delete: {
        type: Boolean,
        default: false
    },
    is_resistance: {
        type: Boolean,
        default: true
    },
    is_cardio: {
        type: Boolean,
        default: true
    },
    is_cardio_preset_delete_id: {
        type: Boolean,
        default: false
    },
    is_resistance_preset_delete_id: {
        type: Boolean,
        default: false
    },
    is_cardio_custom_edit_id: {
        type: Boolean,
        default: false
    },
    is_resistance_custom_edit_id: {
        type: Boolean,
        default: false
    },
    user_id: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("training_program_checks", trainingProgramCheckSchema);
