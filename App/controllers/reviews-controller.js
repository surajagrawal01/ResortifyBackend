const User = require('../models/user-model')
const _ = require('lodash')
const reviewController = {}
const Property = require("../models/property-model")
const { validationResult } = require('express-validator')
const Review = require('../models/review-model')

reviewController.create = async(req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['photos', 'ratings', 'description']) //pick
    const userId = req.user.id
    try {
        // const user = await Review.findOne({propertyId:id,userId:userId})
        // if(user){
        //     return res.status(403).json('you have already gave the review for this resort')
        // }
        const review = new Review(body)
        req.files.forEach((ele, i) => {
            review.photos[i] = ele.filename
        })
        review.propertyId = id
        review.userId = userId

        //
        const noOfReviews = await Review.countDocuments({ propertyId: id })
        const property = Property.findById(id)
        const prevRating = property.rating
        const newRating = ((prevRating * noOfReviews) + (body.ratings)) / (noOfReviews + 1)
        property.rating = newRating
        await property.save()

        await review.save()
        res.status(201).json(review)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
}

reviewController.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = req.params.id
    const body = _.pick(req.body, ['ratings', 'description', 'photos'])
    const userId = req.user.id
    try {

        const review = await Review.findOneAndUpdate({ propertyId: id, userId: userId }, body, { new: true })
        res.status(201).json(review)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
}


reviewController.delete = async (req, res) => {
    const userId = req.user.id
    const id = req.params.id
    const user = await User.findOne({ _id: userId })
    if (!user) {
        res.status(403).json({ error: 'you are authorised for deleting this record' })
    }
    try {
        const review = await Review.findOneAndDelete({ _id: id })
        res.json(review)
    } catch (err) {
        console.log(err)
        res.json({ error: 'internal server error' })
    }

}

reviewController.listOne = async (req, res) => {
    const id = req.params.id;
    try {
        const review = await Review.find({ propertyId: id });
        if (!review) {
            return res.status(404).json("record not found");
        }
        res.json(review);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
};
module.exports = reviewController;
