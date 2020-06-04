const router = require('express').Router();
const {auth} = require('../controllers/authenticationController');
const { checkTour } = require('../middleware/checkTour');

const { createReview, readReview, deleteReview, updateReview } = require('../controllers/reviewController');

router.route('/')
    .post(auth, checkTour, createReview)
    .get(auth, checkTour, readReview)
    .delete(auth, deleteReview)
    .put(auth, updateReview)


module.exports = router;