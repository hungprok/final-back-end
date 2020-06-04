const mongoose = require('mongoose');
const Cate = require('./Cate');
const TourGuide = require('./TourGuide');
const Booking = require('./booking');

const tourSchema = mongoose.Schema({
    tourguide: Object,
    cate: Array,
    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true
    },
    owner: {
        type: Object,
        required: [true, "Book must have an owner"]
    },
    ratingAverage: {
        type: Number,
        default: 0,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5.0"],
        set: value => Math.round(value * 10) / 10
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    groupSize: {
        type: Number,
        required: true,
        min: 1
    },
    availability: {
        type: Number,
        min: 0,
        default: null
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.pre('save', async function (next) {
    if (!this.isModified('groupSize')) {
        next()
    }
    // console.log(this)
    // this._update.availability = this.groupSize - bookedQuantity

    if (this.availability < 0) {
        next(new AppError(400, 'This tour is out of booking number'))
    }

    const bookedQuantity = await Booking.countBooking(this._id)
    // console.log(this)
    this.availability = this.groupSize - bookedQuantity
    this.tourguide = await TourGuide.findById(this.tourguide);
    const cateArray = this.cate.map(async el => await Cate.findById(el))
    this.cate = await Promise.all(cateArray);
    next();
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tourId'
});

tourSchema.pre(/^findOneAnd/, async function (next) {
    if (!this.groupSize) {
        next()
    }
    const bookedQuantity = await Booking.countBooking(this._id)

    this.availability = this.groupSize - bookedQuantity

    if (this.availability < 0) {
        next(new AppError(400, 'This tour is out of booking number'))
    }
    next()
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
