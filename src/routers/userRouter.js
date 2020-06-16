const router = require('express').Router();
const { auth } = require('../controllers/authenticationController');

const { createUser, readUser2, readUser } = require('../controllers/userController');

router.route('/')
    .post(createUser)
router.route('/me')
    .get(auth, readUser)
router.route('/applicants')
    .post(readUser2)

module.exports = router;