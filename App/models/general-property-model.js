const { Schema, model } = require("mongoose");

const genralSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    bookingPolicies: {
      wholeDay: { checkIn: String, checkOut: String },
      // nightOut: { checkIn: String, checkOut: String },
      // dayOut: { checkIn: String, checkOut: String },
    },
    cancellationPolicies: [String],
    propertyRules: {
      guestPolicies: [String],
      acceptableIdentityProofs: [String],
    },
    financeAndLegal: {
      typeOfOwnership: String,
      typeOfDocument: [String],
    },
    bankingDetails: {
      bankingAccountNumber: String,
      IFSCCode: String,
      gstIN: String,
      panNo: String,
    },
  },
  { timestamps: true }
);

const GenrealPropertyModel = model("GenrealPropertyModel", genralSchema);

module.exports = GenrealPropertyModel;
