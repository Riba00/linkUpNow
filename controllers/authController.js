const passport = require("passport");

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/administration',
    failureRedirect: '/signIn',
    failureFlash: true,
    badRequestMessage: 'Fields are required'
})

exports.authenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/signIn');
}