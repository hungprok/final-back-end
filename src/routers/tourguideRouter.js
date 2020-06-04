const router = require('express').Router();
const { auth } = require('../controllers/authenticationController');

const { createTourGuide, updateTourGuide, deleteTourGuide, readTourGuide } = require('../controllers/TourGuideController');

router.route('/')
    .post(auth, createTourGuide)
    .put(auth, updateTourGuide)
    .get(auth, readTourGuide)
    .delete(auth, deleteTourGuide);

module.exports = router;