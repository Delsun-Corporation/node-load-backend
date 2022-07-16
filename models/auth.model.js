const mongoose = require("mongoose");
const crypto = require("crypto"); // encrypt user password

const Schema = mongoose.Schema;

let randomKey =
  Math.random().toString(36).substring(2, 3) +
  "-" +
  Math.random().toString(36).substring(2, 3) +
  "-" +
  Math.random().toString(36).substring(2, 4);

function getDefaultAccountId() {
  if (process.env.NODE_ENV != 'development') {
    return "62c92a3e4605097ca4b90898"
  }

  return "62c928a029c4f2989dd1e2ab"
}


//User Schema
const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    token: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: `User-${randomKey}`,
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: {
      type: String
    },
    country_code: {
      type: String,
    },
    mobile: {
      type: String,
    },
    facebook: {
      type: String,
    },
    date_of_birth: {
      type: String,
    },
    gender: {
      type: String,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    photo: {
      type: String,
    },
    goal: {
      type: String,
    },
    country_id: {
      type: Number,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    membership_code: {
      type: String,
    },
    user_type: {
      type: String,
    },
    account_id: {
      type: String,
      default: getDefaultAccountId()
    },
    is_profile_complete: {
      type: Boolean,
      default: false,
    },
    email_verified_at: {
      type: Date,
    },
    expired_at: {
      type: Date,
    },
    last_login_at: {
      type: Date,
    },
    socket_id: {
      type: String,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    is_snooze: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
    },
    forgot_otp: {
      type: String,
    },
    location: {
      type: String
    },
    phone_area: {
      type: String
    },
    phone_number: {
      type: String
    },
    otp: {
      type: String
    },
    otp_date: {
      type: Date
    }
  },
  { timestamps: true }
);

// Virtual Password
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
};

module.exports = mongoose.model("User", userSchema);
