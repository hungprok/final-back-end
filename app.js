const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("./src/auth/passport");
const cors = require('cors');

const { Login, auth, loginFacebook, authFacebook, authGithub, loginGithub } = require('./src/controllers/authenticationController');
const { Logout, LogoutAll } = require('./src/controllers/logoutController');

mongoose.connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Connected to database")).catch((err) => console.log(err));

const app = express();
const router = express.Router();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(router);
app.use(passport.initialize())

const tourRouter = require('./src/routers/tourRouter');
router.use('/tours', tourRouter);

const tourguideRouter = require('./src/routers/tourguideRouter');
router.use('/tourguides', tourguideRouter);

const reviewRouter = require('./src/routers/reviewRouter');
router.use('/reviews', reviewRouter);

const userRouter = require('./src/routers/userRouter');
router.use('/users', userRouter);

const cateRouter = require('./src/routers/cateRouter');
router.use('/cates', cateRouter);

const bookingRouter = require('./src/routers/bookingRouter');
router.use('/booking', bookingRouter);

router.route('/auth/facebook')
    .get(loginFacebook)
router.route('/auth/facebook/authorized')
    .get(authFacebook)

router.route('/auth/github')
    .get(loginGithub)
router.route('/auth/github/authorized')
    .get(authGithub)

router.route('/login')
    .post(Login)

router.route('/logout')
    .get(auth, Logout)

router.route('/logoutall')
    .get(auth, LogoutAll)

// 404 handler
const AppError = require('./src/utils/AppError');

function notFound(req, res, next) {
    next(new AppError(404, "URL not found"))
};

router.route('/')
    .get((req, res) => { return res.status(200).json({ status: "ok" }) })
router.route("*").all(notFound);

const { errorController } = require('./src/controllers/errorController')
app.use(errorController)



module.exports = app;