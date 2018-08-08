import passport from 'passport';
import mongoose from 'mongoose';
const User = mongoose.model('User');

export default class Authentication {
    static initializePassportAuthentication (app) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(User.createStrategy());
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
    };

    static isAuthenticated (req, res, next) {
        if (req.isAuthenticated())
            return next();
        next(console.log("FORBIDDEN", 403));
    };
}