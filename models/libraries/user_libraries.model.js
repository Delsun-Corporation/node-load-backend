const mongoose = require("mongoose");
const { repetitionMaxDetailObject } = require("./custom/libraries_custom_object.model");

const Schema = mongoose.Schema;

const userLibrariesSchema = new mongoose.Schema(
  {
    saved_common_libraries_detail: {
      type: [
        {
          common_libraries_id: Number,
          is_show_again_message: Boolean,
          exercise_link: String,
          selected_rm: Number,
          repetition_max: [repetitionMaxDetailObject]
        },
      ],
    },
    favorite_libraries: {
      type: [Number],
    },
    user_id: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user_libraries", userLibrariesSchema);
