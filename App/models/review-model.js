const { Schema, model } = require("mongoose");
const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  photos: [String],
  ratings: Number,
  description: String,
  propertyId: Schema.Types.ObjectId,
});
const Review = model("Review", reviewSchema);
module.exports = Review;
