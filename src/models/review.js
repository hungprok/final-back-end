const mongoose = require('mongoose');
const Tour = require('./Tour');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: [true, "Review must have content"],
        minlength: 5
    },
    rating: {
        type: Number,
    },
    tourId: {
        type: String,
        ref: "Tour",
        required: [true, "Review must belong to a tour"]
    },
    username: {
        type: String,
    },
    bookname: {
        type: String,
    }
});

// define func: calculate rating and save
reviewSchema.statics.calcAverageRating = async function (tourId) {
    // calculate
    const stats = await this.aggregate([
        {
            $match: { tourId: tourId }
        },
        {
            $group: {
                _id: "$tourId",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);
    // save to database
    await Tour.findByIdAndUpdate(tourId, {
        ratingAverage: stats.length === 0 ? 0 : stats[0].avgRating,
        ratingQuantity: stats.length === 0 ? 0 : stats[0].nRating
    });
};

reviewSchema.post("save", function () {
    this.constructor.calcAverageRating(this.tourId);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.doc = await this.findOne();
    if (!this.doc) return next(new AppError(404, "Review not found"))
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.doc.constructor.calcAverageRating(this.doc.tourId);
});

// calculate rating and save


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;