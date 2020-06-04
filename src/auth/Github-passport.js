const passport = require("passport");
const GithubStrategy = require("./github");

passport.use(GithubStrategy);

module.exports = passport;