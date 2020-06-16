const catchAsync = require('../utils/catchAsync')
const Booking = require('../models/booking')
const Tour = require('../models/Tour')
const AppError = require('../utils/AppError')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.createBooking = catchAsync(async (req, res, next) => {
    const { id } = req.params
    // console.log("req.params",req.params)
    const { quantity, cc_number,
        cc_exp_month,
        cc_exp_year,
        cc_cvc } = req.body
    try {
        if (!quantity) return next(new AppError(400, 'Booking must have quantity'))

        const tour = await Tour.findById(id);
        // console.log("tour: ",tour)
        const cardToken = await stripe.tokens.create({
            card: {
                number: cc_number,
                exp_month: cc_exp_month,
                exp_year: cc_exp_year,
                cvc: cc_cvc
            }
        })

        const payment = await stripe.charges.create({
            amount: tour.price * quantity * 100,
            currency: 'usd',
            source: cardToken.id,
            description: 'hahahahaha'
        })
        // console.log(payment)

        const paymentID = 'random'
        if (!payment.paid) return next(new AppError(400, 'Cannot charge the card'))
        if (tour.availability < quantity)
            return next(new AppError(400, 'Not enough quantity to book'))
        const booking = await Booking.create({
            user: req.user._id,
            tour: tour._id,
            quantity: quantity,
            total: quantity * tour.price,
            paymentID: payment.id
        })

        tour.availability = tour.availability - quantity
        // Tour.findOneAndUpdate(tour._id, tour)
        tour.save()
        return res.status(200).json({ status: 'booked successfully', data: booking })
    }
    catch (err) {
        return res.status(400).json({ status: "fail", message: err.message });
    }
    next()
})