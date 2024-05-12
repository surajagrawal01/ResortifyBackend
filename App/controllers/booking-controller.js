const { validationResult } = require("express-validator")
const sendMail = require("../../Utility.js/nodemailer")
const BookingModel = require("../models/booking-model")
const Property = require("../models/property-model")
const User = require("../models/user-model")
const _ = require("lodash")
const RoomType = require("../models/roomType-model")
const bookingCntrl = {}
const { format } = require("date-fns");

//for new booking
// bookingCntrl.create = async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(404).json({ errors: errors.array() })
//     }
//     const body  = _.pick(req.body, ['propertyId','userName','bookingCategory','Date','guests','contactNumber','Rooms','packages','totalAmount'])
//     try {
//         const property = await Property.findOne({_id:body.propertyId, isApproved:true})
//         if(!property){
//             return res.status(400).json({err:`can't make booking property not approved` })
//         }
//         const booking1 = new BookingModel(body)
//         let str = 'RST'
//         let count = await BookingModel.find().countDocuments() + 1
//         const user = await User.findById(req.user.id)
//         const owner = await User.findOne({ _id: property.ownerId })
//         booking1.bookingId = str + count
//         booking1.userId = req.user.id
//         booking1.userName = user.name
//         booking1.status = "initiated"

//         await booking1.save()
//         res.send("Booking Initiated")

//         const ownerHTMLMsg = `
//     <p><b>Hi  <br/> There is booking with id: ${booking1.bookingId} </p>
//     `
//         const userHTMLMsg = `
//     <p><b>Hi ${user.name} <br/> We have initiated your booking soon you will receive email once the owner approve your booking </p>
//     `
//         sendMail(owner.email, ownerHTMLMsg)
//         sendMail(user.email, userHTMLMsg)
//     } catch (err) {
//         res.status(500).json({ error: 'Internal Server Error' })
//         console.log(err)
//     }
// }

bookingCntrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "propertyId",
    "userName",
    "bookingCategory",
    "Date",
    "guests",
    "contactNumber",
    "Rooms",
    "packages",
    "totalAmount",
  ]);
  try {
    const property = await Property.findOne({
      _id: body.propertyId,
      isApproved: true,
    });
    if (!property) {
      return res
        .status(400)
        .json({ err: `can't make booking property not approved` });
    }
    const booking1 = new BookingModel(body);
    let str = "RST";
    let count = (await BookingModel.find().countDocuments()) + 1;
    const user = await User.findById(req.user.id);
    user.myBookings = [...user.myBookings, booking1._id];
    const owner = await User.findOne({ _id: property.ownerId });
    booking1.bookingId = str + count;
    booking1.userId = req.user.id;
    booking1.userName = user.name;
    booking1.status = "initiated";

    //for totalAMount
    const RoomTypes = await RoomType.find({ propertyId: body.propertyId });
    let RoomPrice = 0;
    body.Rooms.forEach((room1) => {
      const room = RoomTypes.find((ele) => ele._id == room1.roomTypeId);
      RoomPrice += room.baseRoomPrice * room1.NumberOfRooms;
    });

    let PackagePrice = 0;
    body.packages.forEach((ele) => {
      const package = property.packages.find((pack) => pack._id == ele.packId);
      PackagePrice += Number(package.price);
    });

    booking1.totalAmount =
      RoomPrice + PackagePrice + (RoomPrice + PackagePrice) * 0.12;
    await user.save();
    await booking1.save();
    res.send("Booking Initiated");

    const ownerHTMLMsg = `
    <p><b>Hi  <br/> There is booking with id: ${booking1.bookingId} </p>
    `;
    const userHTMLMsg = `
    <p><b>Hi ${user.name} <br/> We have initiated your booking soon you will receive email once the owner approve your booking </p>
    `;
    sendMail(owner.email, ownerHTMLMsg, "New Booking");
    sendMail(user.email, userHTMLMsg, "Booking Initiated");
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
};

// to changing status of booking
// bookingCntrl.changeStatus = async (req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()})
//     }
//     const bookingId = req.params.id
//     const status = req.query.status
//     try {
//         const owner = await User.findOne({_id:req.user.id})
//         const property = await Property.findOne({ ownerId: owner._id })
//         const booking = await BookingModel.findOneAndUpdate({ _id: bookingId, propertyId: property._id }, { $set: { status: status } }, { new: true })
//         const user = await User.findById(booking.userId)
//         if (booking.status == 'approved') {
//             const userHTMLMsg = `
//             <p><b>Hi ${user.name} <br/> Booking gets approved by owner, please use the link to make the payment for your booking on ${String(booking.Date.checkIn).slice(0, 10)} at ${property.propertyName} </p>
//             `
//             sendMail(user.email, userHTMLMsg)
//             res.json('Mail Sent to user')
//             setTimeout(async() => {
//                 const booking = await BookingModel.findOne({ _id: bookingId, propertyId: property._id })
//                 if (booking.isPaymentDone == 'true') {
//                     const ownerHTMLMsg = `
//                     <p><b>Hi <br/>Pyament Done Booking Confirmed for ${booking.bookingId}.`
//                     sendMail(owner.email, ownerHTMLMsg )
//                 } else {
//                     const userHTMLMsg = `
//                     <p><b>Hi ${user.name} <br/> Sorry for the inconvenience, You didn't completed the payment so we are giving priority to another one.`
//                     sendMail(user.email, userHTMLMsg)
//                     console.log('Mail sent for giving priority to another one')
//                 }
//             }, (1000 * 60))
//         } else if (booking.status == 'notApproved') {
//             const userHTMLMsg = `
//             <p><b>Hi ${user.name} <br/> Sorry for the inconvenience, Booking gets not approved by owner,there are some maintainance work going on.`
//             sendMail(user.email, userHTMLMsg)
//             res.json('Mail Sent to User')
//         }
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ error: 'Internal Server Error' })
//     }
// }

//toChangestatus with mail of bookingId
bookingCntrl.changeStatus = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const bookingId = req.params.id
    const status = req.query.status
    try {
        const owner = await User.findOne({_id:req.user.id})
        const property = await Property.findOne({ ownerId: owner._id })
        const booking = await BookingModel.findOneAndUpdate({ _id: bookingId, propertyId: property._id }, { $set: { status: status } }, { new: true })
        const user = await User.findById(booking.userId)
        const link = `https://resortify-frontend.vercel.app/booking/payment/${booking._id}`
        if (booking.status == 'approved') {
            const userHTMLMsg = `
            <p><b>Hi ${user.name} <br/> Booking gets approved by owner, please use the <a href=${link}>link</a> to make the payment for your booking on ${String(booking.Date.checkIn).slice(0, 10)} at ${property.propertyName} </p>
            `
            sendMail(user.email, userHTMLMsg, "Booking Approved")
            res.json(booking)
            setTimeout(async() => {
                const booking = await BookingModel.findOne({ _id: bookingId, propertyId: property._id })
                if (booking.isPaymentDone == 'true') {
                    
                } else {
                    //to delete the record if payment not done within given period of time
                    const bookingDelete = await BookingModel.findOneAndUpdate({bookingId:booking.bookingId}, {$set:{isDeleted:"true"}}) //change on 4th April
                    const userHTMLMsg = `
                    <p><b>Hi ${user.name} <br/> Sorry for the inconvenience, You didn't completed the payment so we are giving priority to another one.`
                    sendMail(user.email, userHTMLMsg, "Booking Cancelled")
                    console.log('Mail sent for giving priority to another one')
                }
            }, (1000 * 600))
        } else if (booking.status == 'notApproved') {
            const userHTMLMsg = `
            <p><b>Hi ${user.name} <br/> Sorry for the inconvenience, Booking gets not approved by owner,there are some maintainance work going on.`
            sendMail(user.email, userHTMLMsg, "Booking UnApproved")
            res.json(booking)
        }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//for updating checkedIn and checkedOut
bookingCntrl.changeCheckInOut = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const bookingId = req.params.id;
  const type = req.query.type;
  try {
    const property = await Property.findOne({ ownerId: req.user.id });
    if (type == "isCheckedIn") {
      const booking = await BookingModel.findOneAndUpdate(
        { _id: bookingId, propertyId: property._id, isPaymentDone: "true" },
        { $set: { isCheckedIn: "true" } },
        { new: true }
      );
      res.json(booking);
    } else if (type == "isCheckedOut") {
      const booking = await BookingModel.findOneAndUpdate(
        { _id: bookingId, propertyId: property._id, isCheckedIn: "true" },
        { $set: { isCheckedOut: "true" } },
        { new: true }
      );
      res.json(booking);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//for today listing booking related to particularowner
bookingCntrl.listTodayBookings = async (req, res) => {
    const from = req.query.from
    const to = new Date(req.query.to).setHours(23, 59, 59, 999)
    try {
        const rangeQuery = {$gte: new Date(from), $lte: new Date(to)}
        const property = await Property.findOne({ ownerId: req.user.id })
        let bookings 
        if(property){
            bookings = await BookingModel.find({ propertyId: property._id, createdAt: rangeQuery}).populate('Rooms.roomTypeId',['roomType','_id']).sort({_id:-1})
        }else{
            bookings = []
        }
        res.json(bookings)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//for listing booking related to particularowner for particular range
bookingCntrl.listBookings = async (req, res) => {
  const from = req.query.from;
  const to = new Date(req.query.to).setHours(23, 59, 59, 999);
  try {
    const checkInQuery = { $gte: new Date(from) };
    const checkOutQuery = { $lte: to };
    const property = await Property.findOne({ ownerId: req.user.id });
    const bookings = await BookingModel.find({
      propertyId: property._id,
      "Date.checkIn": checkInQuery,
      "Date.checkOut": checkOutQuery,
    })
      .populate("Rooms.roomTypeId", ["roomType", "_id"])
      .sort({ _id: -1 });
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

bookingCntrl.calculate = async (req, res) => {
  try {
    const property = await Property.findOne({ ownerId: req.user.id });
    const totalBookings = await BookingModel.find();
    const bookings = await BookingModel.aggregate([
      { $match: { propertyId: property._id } },
      {
        $group: {
          _id: "$Date.checkIn",
          bookings: { $sum: "$totalAmount" }, // Group bookings by month
        },
      },
    ]);
    const monthlyBookings = {};
    bookings.forEach((booking) => {
      const month = new Date(booking._id).toLocaleString("en-us", {
        month: "short",
      });
      if (!monthlyBookings[month]) {
        monthlyBookings[month] = 0;
      }
      monthlyBookings[month] += booking.bookings;
    });

    // Transform the result into the desired format
    const result = Object.entries(monthlyBookings).map(([month, totalSum]) => ({
      id: month,
      totalSum: totalSum,
    }));

    res.json({ result });
  } catch (err) {
    console.log(err);
  }
};
//for listing booking related to particularowner
bookingCntrl.listOne = async (req, res) => {
  const id = req.params.id;
  try {
    const booking = await BookingModel.findOne({
      _id: id,
      isDeleted: "false",
    }).populate("Rooms.roomTypeId", ["roomType", "_id"]); //chnages here on 04th April
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//for cancellation
bookingCntrl.cancellation = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await BookingModel.findOneAndUpdate(
      {
        userId: req.user.id,
        isPaymentDone: "true",
        isCancelled: false,
        _id: bookingId,
      },
      { $set: { isCancelled: "true" } },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

bookingCntrl.Stats = async (req, res) => {
  try {
    const property = await Property.findOne({ ownerId: req.user.id });
    const response = await BookingModel.find({ propertyId: property._id });
    const bookings = await BookingModel.aggregate([
      { $match: { propertyId: property._id } },
      {
        $group: {
          _id: "$isPaymentDone", // Group by the value of the isPaymentDone field
          count: { $sum: 1 }, // Count the number of bookings in each group
          approvedCount: {
            $sum: {
              $cond: {
                if: { $eq: ["$status", "approved"] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    ]);
    res.json({ bookings, response });
  } catch (err) {
    console.log(err);
  }
};

module.exports = bookingCntrl;
