const router = require('express').Router({ mergeParams: true });
const { createBooking } = require('../controllers/bookingController')
const { auth } = require('../controllers/authenticationController')
const { checkTour } = require('../middleware/checkTour')

router.route('/:id')
    .post(auth, checkTour, createBooking)

module.exports = router;