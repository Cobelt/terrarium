import mongoose from 'mongoose';
const User = mongoose.model('User');

class UserController {

    static simulateCreationForm (req, res, next) {
        console.log(req.params);
        req.body.username = req.params.username;
        req.body.password = req.params.password;
        next();
    }

    static create (req, res, next) {
        const { username, password } = req.body;

        if (username && password) {
            const newUser = new User(req.body);

            User.register(newUser, password, (err, newRegistredUser) => {
                if (err) return res.send(err);
                // TODO envoyer email de confirmation d'inscription
                // const authenticate = User.authenticate();
                // authenticate('username', 'password', function(err, result) {
                //     if (err) return next(err);
                //
                //     // Value 'result' is set to false. The user could not be authenticated since the user is not active
                // });

                res.send(newRegistredUser);
            });
        }
        else {
            next(console.log("MISSING_DATA", 400));
        }
    }

    static mapAll (req, res) {
        User.find({}, (err, users) => {
            var userMap = {};

            users.forEach(function(user) {
                userMap[user._id] = user;
            });

            req.user = userMap;
        });
    }

    static get (req, res, next) {
        if(req.params.userId) {
            User.findOne({"_id": req.params.userId}, (err, user) => {
                req.user = user;
                next(err)
            });
        }
        else {
            next(console.log('NO_USER_SPECIFIED', 400));
        }
    }

    static send (req, res) {
        res.send(req.user);
    }

}

export default UserController;