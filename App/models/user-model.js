const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    email: String,
    contactNo: Number,
    password: String,
    role: String,
    otp: String,
    recentSearches: {
      type: [Schema.Types.ObjectId],
      ref: "Property",
    },
    myBookings: {
      type: [Schema.Types.ObjectId],
      ref: "BookingModel",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
