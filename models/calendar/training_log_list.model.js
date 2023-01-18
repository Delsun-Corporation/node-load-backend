const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const generated_calculations = {
  total_distance_code: String,
  avg_speed: Number,
  total_distance: Number,
  avg_speed_code: String,
  avg_speed_unit: String,
  total_duration_code: String,
  total_duration: String,
  total_duration_minutes: Number,
  avg_pace_code: Number,
  total_distance_unit: String,
  avg_pace: String,
  avg_pace_unit: String,
};

// "exercise" : [
//   {
//     "name" : "Biceps Curls",
//     "data" : [
//       {
//         "is_completed" : false,
//         "duration" : "",
//         "rest" : "01:00",
//         "weight" : "0.3",
//         "reps" : "13"
//       }
//     ],
//     "is_completed" : false,
//     "exercise_link" : "",
//     "common_library_id" : 55,
//     "library_id" : 0
//   }
// ],

const trainingExercise = [
  {
    is_completed: Boolean,
    speed: String,
    pace: String,
    laps: String,
    percentage: String,
    duration: String,
    distance: Number,
    rest: String,
    rpm: String,
    name: String,
    common_library_id: Number,
    data: {
      type: [
        {
          is_completed: Boolean,
          duration: String,
          rest: String,
          weight: String,
        reps: String
        }
      ]
    }
  },
];

const trainingLogListSchema = new mongoose.Schema(
  {
    is_complete: Boolean,
    workout_name: String,
    comments: String,
    notes: String,
    is_log: Boolean,
    training_intensity_id: Number,
    status: String,
    user_id: Number,
    date: Date,
    training_goal_id: Number,
    training_activity_id: Number,
    targeted_hr: String,
    user_own_review: String,
    training_goal_custom: String,
    exercise: {
      type: trainingExercise,
    },
    generated_calculations,
  },
  { timestamps: true }
);

module.exports = mongoose.model("training_log_lists", trainingLogListSchema);
