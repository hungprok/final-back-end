const passport = require("passport-github2");
const GithubStrategy = passport.Strategy;
const User = require('../models/user');

module.exports = (new GithubStrategy({
    clientID: process.env.GIT_ID,
    clientSecret: process.env.GIT_SECRET,
    callbackURL: process.env.DOMAIN + process.env.GIT_CB,
},
    async function (accessToken, refreshToken, profile, cb) {
        console.log(profile._json);
        const {name, email} = profile._json;
        const user = await User.findOneOrCreate({name, email})
        await user.generateToken()
        console.log(user)
        cb(null, user)
    }
))