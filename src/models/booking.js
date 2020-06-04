const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    paymentID: {
        type: String,
        default: null,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

schema.pre('save', async function(next){

})

schema.statics.countBooking = async function (tourId){
    const result = await this.aggregate([
        {$match: {tour: tourId}},
        {$group: {_id: '$tour', count: {$sum: '$quantity'}}}
    ])
    return result[0] ? result[0].count : 0
}

const Booking = mongoose.model('Booking', schema);


module.exports = Booking;