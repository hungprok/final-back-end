const passport = require("passport-google-oauth2");
const FacebookStrategy = passport.Strategy;
const User = require('../models/user');

module.exports = (new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.DOMAIN + process.env.FB_CB,
    scope: ["email", "profile"]
},
    async function (accessToken, refreshToken, profile, cb) {
        // console.log(profile._json);
        const {name, email} = profile._json;
        const user = await User.findOneOrCreate({name, email})
        await user.generateToken()
        console.log(user)
        cb(null, user)
    }
))