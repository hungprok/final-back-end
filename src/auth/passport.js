const passport = require("passport");
const FacebookStrategy = require("./facebook");

passport.use(FacebookStrategy);

const GithubStrategy = require("./github");

passport.use(GithubStrategy);

module.exports = passport;