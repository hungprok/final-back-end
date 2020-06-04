const router = require('express').Router();
const {auth} = require('../controllers/authenticationController');

const {createTour, readTour, updateTour} = require('../controllers/TourController');

router.route('/')
.post(auth, createTour)
.put(auth, updateTour)
.get(auth, readTour)
// .delete(deleteTourGuide);

module.exports = router;