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
    custom_common_libraries: {
        type: [
            {
                id:{
                    type: Number
                },
                exercise_name: {
                    type: String
                },
                category_id: {
                    type: Number
                },
                sub_header_id: {
                    type: Number
                },
                body_image_type: {
                    type: Number
                },
                regions_ids: {
                    type: String
                },
                regions_secondary_ids: {
                    type: String
                },
                motion: String,
                movement: String,
                mechanics_id: Number,
                targeted_muscles_ids: {
                    type: String
                },
                action_force_id: Number,
                equipment_ids: {
                    type: String
                },
                exercise_link: {
                    type: String
                },
                is_favorite: Number,
                is_active: Number,
                repetition_max: {
                    type: [
                        repetitionMaxDetailObject
                    ]
                },
                is_show_again_message: Boolean,
                common_libraries_id: Number,
                selected_rm: Number,
                created_at: {
                    type: Date
                },
                updated_at: {
                    type: Date
                }
            }
        ]
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
