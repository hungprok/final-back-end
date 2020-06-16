const router = require('express').Router();
const {auth} = require('../controllers/authenticationController');

const {createTour, readTour, updateTour, deleteTour} = require('../controllers/TourController');

router.route('/')
.post(auth, createTour)
.put(auth, updateTour)
.get(auth, readTour)
.delete(auth, deleteTour);

module.exports = router;