const router = require('express').Router();
const { auth } = require('../controllers/authenticationController');

const { createUser, readUser } = require('../controllers/userController');

router.route('/')
    .post(createUser)
router.route('/me')
    .get(auth,readUser)

module.exports = router;