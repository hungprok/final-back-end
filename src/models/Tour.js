const mongoose = require('mongoose');
const Cate = require('./Cate');
const TourGuide = require('./TourGuide');
const Booking = require('./booking');

const tourSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, "jobTitle is required."],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, "salary is required."],
        trim: true
    },
    currency: {
        type: String,
        required: [true, "currency is required."],
        trim: true
    },
    category: {
        type: String,
        required: [true, "currency is required."],
        trim: true
    },
    companyName: {
        type: String,
        required: [true, "companyName is required."],
        trim: true
    },
    address: {
        type: String,
        required: [true, "address is required."],
        trim: true
    },
    city: {
        type: String,
        required: [true, "city is required."],
        trim: true
    },
    jd: {
        type: String,
        required: [true, "Job Description is required."],
        trim: true
    },
    jr: {
        type: String,
        required: [true, "Job Requirement is required."],
        trim: true
    },
    benefit: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        required: [true, "Post status is required."],
    },
    owner: {
        type: Object,
        required: [true, "Post must have an owner"]
    },
    applicants: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// tourSchema.pre('save', async function (next) {
//     if (!this.isModified('groupSize')) {
//         next()
//     }
//     // console.log(this)
//     // this._update.availability = this.groupSize - bookedQuantity

//     if (this.availability < 0) {
//         next(new AppError(400, 'This tour is out of booking number'))
//     }

//     const bookedQuantity = await Booking.countBooking(this._id)
//     // console.log(this)
//     this.availability = this.groupSize - bookedQuantity
//     this.tourguide = await TourGuide.findById(this.tourguide);
//     const cateArray = this.cate.map(async el => await Cate.findById(el))
//     this.cate = await Promise.all(cateArray);
//     next();
// });

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
