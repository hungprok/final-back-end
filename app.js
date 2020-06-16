const express = require('express');
require('dotenv').config();
const handlebars = require('express-handlebars');

const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("./src/auth/passport");
const cors = require('cors');
const { loadData, saveData } = require("./src/utils/data");
const fs = require("fs");
const { Login, auth, loginFacebook, authFacebook, authGithub, loginGithub } = require('./src/controllers/authenticationController');
const { Logout, LogoutAll } = require('./src/controllers/logoutController');
const { jobSeeker, PostCV } = require('./src/controllers/jobSeeker');
const upload = require("./src/utils/upload");
const path = require('path');
const Tour = require('./src/models/Tour');
const User = require('./src/models/user');

mongoose.connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Connected to database")).catch((err) => console.log(err));

const app = express();
const router = express.Router();

app.set('views', path.join(__dirname, './views/'))
app.engine('.hbs', handlebars({
    defaultLayout: 'planB',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');




app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(bodyParser.json());
app.use(router);
app.use(passport.initialize())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const tourRouter = require('./src/routers/tourRouter');
router.use('/jobs', tourRouter);

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

router.route('/jobseekers')
    .get(jobSeeker)

router.get('/jobs/:jobID/candidates/:candidateID', (req, res) => {
    let data = loadData()
    console.log(data)
    console.log(req.params)
    let candidateID = req.params.candidateID
    console.log(candidateID)
    let candidate = data.filter(item => item.userid == candidateID)
    console.log(candidate)
    let fileName = candidate[0].name
    console.log(fileName)
    res.render('main', { fileName })
});

router.post("/test", upload.single("fileUpload"), async (req, res) => {
    console.log('uploading file');
    console.log(req.body)
    try {
        if (!req.file) { // user didn't upload anything
            throw new Error('Please choose a file')
        };
        let data = loadData();
        const tour = await Tour.findById(req.body.jobid);
        if (tour.applicants.includes(req.body.userid)) {
            return res.status(201).json({ status: 'You already applied this job' })
        }
        tour.applicants.push(req.body.userid)
        await tour.save();
        const user = await User.findById(req.body.userid);
        console.log(user)
        user.phoneNumber = req.body.phone
        await user.save();
        const newData = { userid: req.body.userid, name: req.file.originalname };
        data.push(newData)
        saveData(data)
        res.status(201).json({ status: 'ok' })
    } catch (e) {
        return res.status(400).json({ status: 'error' })
    }
});

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