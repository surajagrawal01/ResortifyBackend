const Property = require("../models/property-model");
const GenrealPropertyModel = require("../models/general-property-model");
const RoomType = require("../models/roomType-model");
const Room = require("../models/room-model");
const User = require("../models/user-model");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const Review = require("../models/review-model");
const BookingModel = require("../models/booking-model");
const propertyController = {};

const { ObjectId } = require("mongodb");

// list the resorts
propertyController.list = async (req, res) => {
  try {
    const properties = await Property.find({
      isDeleted: false,
    }).populate("ownerId"); // find using isapproved
    res.json(properties);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// create the resorts
// propertyController.create=async(req,res)=>{
//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         return res.status(400).json({error:errors.array()})
//     }
//     const body = _.pick(req.body,['totalRooms',
//                                     'propertyName',
//                                     'propertyBuiltDate',
//                                     'packages',
//                                     'contactNumber',
//                                     'ownerEmail',
//                                     'location',
//                                     'geoLocation'
//                                     ,'propertyAmenities',
//                                     'propertyPhotos'
//                                     ])
//     const generalmodelData =  _.pick(req.body,['bookingPolicies',
//                                                 'cancellationPolicies',
//                                                 'refundPolicies',
//                                                 'propertyRules',
//                                                 'financeAndLegal',
//                                                 'bankingDetails'])

//     const {roomTypesData} = req.body
//     console.log(req.body)
//     try{
//         const property = new Property(body)
//         property.ownerId = req.user.id
//         const generalModel = new GenrealPropertyModel(generalmodelData)

//         generalModel.propertyId = property._id

//         // creating types of rooms
//         const totalRoomTypes =[]
//         roomTypesData.forEach( ele =>{
//                 totalRoomTypes.push({...ele,propertyId:property._id})
//         })
//         await RoomType.insertMany(totalRoomTypes)
//         const roomTypes = await RoomType.find({propertyId:property._id})
//         roomTypes.forEach(async(ele) =>{
//             for(let i=0; i< ele.NumberOfRooms;i++){
//               await Room.create({roomTypeId:ele._id,type:ele.roomType})  // try to use insert many
//             }
//         })

//         let basePrice = 0
//         roomTypesData.forEach((ele)=>{
//             if(basePrice == 0 ){
//                 basePrice = ele.baseRoomPrice
//             }else if(ele.baseRoomPrice <= basePrice ){
//                 basePrice = ele.baseRoomPrice
//             }
//         })
//         property.basePrice = basePrice

//         await property.save()
//         await generalModel.save()
//         console.log({property,generalModel,roomTypes})
//         res.status(201).json({property,generalModel,roomTypes}) //destructuring to display all the detal

//     }catch(err){
//         console.log(err)
//         res.status(500).json({error:'internal server error'})
//     }
// }

propertyController.propertycreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const body = _.pick(req.body, [
    "totalRooms",
    "propertyName",
    "propertyDescription",
    "propertyBuiltDate",
    "basePrice",
    "packages",
    "contactNumber",
    "ownerEmail",
    "location",
    "geoLocation",
    "propertyAmenities",
    "propertyPhotos",
  ]);
  try {
    const property = new Property(body);
    console.log(property);
    property.ownerId = req.user.id;
    await property.save();
    res.json(property);
  } catch (err) {
    console.log(err);
  }
};

// for general model
propertyController.generalModelCreate = async (req, res) => {
  // const errors = validationResult(req)
  // if(!errors.isEmpty()){
  //     return res.status(400).json({error:errors.array()})
  // }
  const generalmodelData = _.pick(req.body, [
    "bookingPolicies",
    "cancellationPolicies",
    "refundPolicies",
    "propertyRules",
    "financeAndLegal",
    "bankingDetails",
  ]);
  try {
    const generalModel = new GenrealPropertyModel(generalmodelData);
    const property = await Property.findOne({ ownerId: req.user.id }); //find by property._id
    generalModel.propertyId = property._id;
    await generalModel.save();
    res.json(generalModel);
    console.log(generalModel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

propertyController.roomtypecreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const roomTypesData = req.body;
    // console.log(roomTypesData);
    // const room = new Room(body);
    //creating types of rooms
    const property = await Property.findOne({ ownerId: req.user.id });
    const roomtype = new RoomType(roomTypesData);
    roomtype.propertyId = property._id;
    await roomtype.save();

    //  const totalRoomTypes = [];

    // roomTypesData.forEach((ele) => {
    //   totalRoomTypes.push({ ...ele, propertyId: property._id });
    // });
    // console.log(totalRoomTypes);

    // const data = await RoomType.insertMany(totalRoomTypes);
    // console.log(data);
    // const roomTypes = await RoomType.find({ propertyId: property._id });
    res.json(roomtype);
    // console.log(roomTypes);
  } catch (err) {
    console.log(err);
  }
};
propertyController.addRooms = async (req, res) => {
  const id = req.params.id;

  console.log(propertyid);
  try {
    // const result = await RoomType.aggregate([
    //   { $match: { propertyId: objectId } },
    //   {
    //     $group: { _id: "$propertyId", addedRooms: { $sum: "$NumberOfRooms" } },
    //   },
    // ]);
    // const result = await RoomType.find({ propertyId: propertyid });
    console.log(propertyid);
    res.json(propertyid);
  } catch (err) {
    console.log(err);
  }
};
propertyController.generalModeList = async (req, res) => {
  try {
    const generalPropertyModel = await GenrealPropertyModel.find().populate(
      "propertyId",
      ["ownerId"]
    );
    res.json(generalPropertyModel);
  } catch (err) {
    console.log(err);
    res.json({ error: "Internal Server Error" });
  }
};
//update the information of resorts
propertyController.update = async (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, [
    "totalRooms",
    "propertyName",
    "propertyBuiltDate",
    "packages",
    "basePrice",
    "contactNumber",
    "location",
    "geoLocation",
    "propertyAmenities",
    "propertyPhotos",
  ]);
  try {
    const property = await Property.findOneAndUpdate(
      { _id: id, ownerId: req.user.id },
      body,
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ error: "record not found!" });
    }
    res.json({ property });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};
propertyController.updateGeneralModel = async (req, res) => {
  const generalmodelData = _.pick(req.body, [
    "bookingPolicies",
    "cancellationPolicies",
    "refundPolicies",
    "propertyRules",
    "financeAndLegal",
    "bankingDetails",
  ]);
  try {
    const generalModel = await GenrealPropertyModel.findOneAndUpdate(
      { propertyId: property._id },
      generalmodelData,
      { new: true }
    );
    res.json({ generalModel });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// delete the property record
propertyController.delete = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    const property = await Property.findOne({ _id: id, ownerId: req.user.id });
    if (!property) {
      return res.status(404).json({ error: "record not found!" });
    }
    if (type === "soft") {
      const property = await Property.findOneAndUpdate(
        { _id: id },
        { isDeleted: true },
        { new: true }
      );
      return res.json(property);
    } else if (type === "restore") {
      const property = await Property.findOneAndUpdate(
        { _id: id },
        { isDeleted: false },
        { new: true }
      );
      return res.json(property);
    } else if (type === "hard") {
      const property = await Property.findOneAndDelete({ _id: id });
      return res.json(property);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal sever error" });
  }
};

// get one record of the resort
propertyController.listOne = async (req, res) => {
  const { id } = req.params;

  const checkIn = req.query.checkIn;
  const checkOut = new Date(req.query.checkOut).setHours(23, 59, 59, 999);

  const checkInQuery = { $gte: new Date(checkIn) };
  const checkOutQuery = { $lte: new Date(checkOut) };

  try {
    const property = await Property.findOne({ _id: id });
    const roomTypes = await RoomType.find({
      propertyId: property._id,
    }).populate("roomAmentities", ["_id", "name"]);
    const generalProperyData = await GenrealPropertyModel.findOne({
      propertyId: property._id,
    });
    const reviews = await Review.find({ propertyId: property._id }).populate(
      "userId",
      ["_id", "name"]
    );
    //all bookings in this particular range
    const bookings = await BookingModel.find({
      propertyId: id,
      "Date.checkIn": checkInQuery,
      "Date.checkOut": checkOutQuery,
    }).populate("Rooms.roomTypeId", ["_id", "roomType", "NumberOfRooms"]);

    // get the rooms based on booking status
    res.json({ property, generalProperyData, roomTypes, reviews, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// controller for user to store his recent searches

propertyController.listForMySearches = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // will come from the token
  const checkIn = req.query.checkIn;
  const checkOut = new Date(req.query.checkOut).setHours(23, 59, 59, 999);

  const checkInQuery = { $gte: new Date(checkIn) };
  const checkOutQuery = { $lte: new Date(checkOut) };

  try {
    const property = await Property.findOne({ _id: id });
    const roomTypes = await RoomType.find({
      propertyId: property._id,
    }).populate("roomAmentities", ["_id", "name"]);
    const generalProperyData = await GenrealPropertyModel.findOne({
      propertyId: property._id,
    });
    const reviews = await Review.find({ propertyId: property._id }).populate(
      "userId",
      ["_id", "name"]
    );
    //all bookings in this particular range
    const bookings = await BookingModel.find({
      propertyId: id,
      "Date.checkIn": checkInQuery,
      "Date.checkOut": checkOutQuery,
    }).populate("Rooms.roomTypeId", ["_id", "roomType", "NumberOfRooms"]);

    // changes to include recent searches

    const user = await User.findOne({ _id: userId });
    if (!user.recentSearches.includes(property._id)) {
      user.recentSearches = [...user.recentSearches, property._id];
    }

    await user.save();
    // get the rooms based on booking status
    res.json({ property, generalProperyData, roomTypes, reviews, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// controller for admin to appprove the property
propertyController.adminApprove = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findOneAndUpdate(
      { _id: id },
      { $set: { isApproved: true } },
      { new: true }
    );
    if (!property) {
      res.status(404).json({ error: "record not found" });
    }
    res.json(property);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};
// propertyController.photos = (req, res) => {
//   const arr = [];
//   if (Array.isArray(req.files)) {
//     req.files.forEach((ele) => {
//       arr.push(ele.filename);
//     });
//     return res.json(arr);
//   } else {
//     return res.status(400).json("error in multer");
//   }
// };
propertyController.photos = async (req, res) => {
  try {
    const property = await Property.findOne({ ownerId: req.user.id });
    const arr = [];
    if (Array.isArray(req.files)) {
      req.files.forEach((ele) => {
        arr.push(ele.filename);
      });
      property.propertyPhotos = arr;
      await property.save();
      return res.json(property);
    } else {
      return res.status(400).json("error in multer");
    }
  } catch (err) {
    console.log(err);
  }
};

propertyController.documents = (req, res) => {
  const arr = [];
  if (Array.isArray(req.files)) {
    req.files.forEach((ele) => {
      arr.push(ele.filename);
    });
    return res.json(arr);
  } else {
    return res.status(400).json("error in multer");
  }
};

//based on query - By Suraj on 04th April 2024

propertyController.lists = async (req, res) => {
  const city = req.query.city;
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page)
  const searchQuery = { "location.city": city }
  const maxPrice = req.query.maxPrice || Infinity
  const minPrice = req.query.minPrice || 0
  const rating = Boolean(req.query.rating) ? req.query.rating : 0 
  const ratingQuery = {rating:{$gte:rating}}
  const priceQuery = {basePrice : {$gte:minPrice, $lte: maxPrice}}
  const findQuery = {...searchQuery, ...priceQuery, ...ratingQuery}

  // changes for sort by Sufal
  const order = req.query.order === "undefined" ? "low" : req.query.order;
  const value = order === "low" ? 1 : -1;
  const sortQuery = {};
  sortQuery["basePrice"] = value;
  try {
    const properties = await Property.find(findQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortQuery)
      .populate("propertyAmenities", ["_id", "name"]);
    const total = await Property.countDocuments(findQuery);
    res.json({
      data: properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

propertyController.Stats = async (req, res) => {
  try {
    const response = await Property.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by month and year
          totalProperties: { $sum: 1 }, // Count the properties
        },
      },
      { $sort: { _id: 1 } }, // Optionally sort the result by month/year
    ]);
    const resortTotal = {};
    response.forEach((ele) => {
      const month = new Date(ele._id).toLocaleString("en-us", {
        month: "short",
      });
      if (!resortTotal[month]) {
        resortTotal[month] = 0;
      }
      resortTotal[month] += ele.totalProperties;
    });
    const result = Object.entries(resortTotal).map(
      ([month, totalProperties]) => ({
        month: month,
        resort: totalProperties,
      })
    );
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = propertyController;
