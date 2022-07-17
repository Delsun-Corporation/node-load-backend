const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cancelationPoliciesSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        name: {
            type: String
        },
        code: {
            type: String
        },
        description: {
            type: String
        },
        is_active: {
            type: Number
        },
        created_at: {
            type: Date
        },
        updated_at: {
            type: Date
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("cancelation_policies", cancelationPoliciesSchema);