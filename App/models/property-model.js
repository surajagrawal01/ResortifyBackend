const { Schema, model } = require("mongoose");
const propertySchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalRooms: Number,
    propertyName: String,
    propertyBuiltDate: Date,
    propertyDescription: String,
    packages: [
      {
        package: String,
        price: String,
        isChecked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    ownerEmail: String,
    isApproved: {
      type: Boolean,
      default: false,
    },
    location: {
      houseNumber: String,
      locality: String,
      area: String,
      pincode: String,
      city: String,
      state: String,
      country: String,
    },
    geoLocation: {
      lat: String,
      lng: String,
    },
    propertyAmenities: {
      type: [Schema.Types.ObjectId],
      ref: "Amenity",
    },
    propertyPhotos: [String],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    basePrice: Number,
    rating: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);
const Property = model("Property", propertySchema);
module.exports = Property;
