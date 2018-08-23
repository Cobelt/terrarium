import passport from 'passport';

class AuthenticationController {

    static simulateConnectionForm(req, res, next) {
        next();
    }

    static login(req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) { // authentication failed
                return next(console.log(info.message, 403, info));
            }

            req.login(user, err => {
                if (err) next(err);
                else {
                    req.session.typeVisitor = 'User';
                    req.session.userId = user.id;
                    res.send({
                        message: "You have been successfully logged in.",
                        isAuthenticated: req.isAuthenticated(),
                        isAdmin: false,
                    });
                }
            });
        })(req, res, next);
    }

    static logout(req, res, next) {
        req.logout();
        req.session.destroy(function (err) {
            if (err) { return next(err); }
            const isAuthenticated = req.isAuthenticated();
            if (isAuthenticated) {
                return next(console.log(null, 500, {isAuthenticated: isAuthenticated}));
            }
            res.clearCookie('connect.sid');
            res.send({
                message: "You have been successfully logged out.",
                isAuthenticated: isAuthenticated,
                isAdmin: false,
            });
        });
    }

    static getSessionInfos(req, res, next) {
        res.send({
            message: req.session.visited.length > 2 ? "Session already open" : "Session opened",
            isAuthenticated: req.isAuthenticated(),
            isAdmin: true // TODO
        });
    }
}

export default AuthenticationController;