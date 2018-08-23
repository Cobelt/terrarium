import mongoose from 'mongoose';
const User = mongoose.model('User');

class UserController {

    static create (req, res, next) {
        const { username, password } = req.body;
        if (username && password) {
            const newUser = new User(req.body);

            User.register(newUser, password, (err, newRegistredUser) => {
                if (err) {
                    console.log(err);
                    return (err.name === 'UserExistsError') ? res.status(500).send('USER ALREADY EXISTS') :  res.send(err);
                }
                console.log('[User] New entity created');

                const authenticate = User.authenticate();
                authenticate(newUser.username, password, (err, result) => {
                    if (err) return next(err);
                     // Value 'result' is set to false. The user could not be authenticated since the user is not active
                });

                req.user = newRegistredUser;
                next();
            });
        }
        else {
            res.status(400).send("MISSING_DATA");
        }
    }

    static getAll (req, res) {
        User.find({}, (err, users) => {
            if (err) return res.send(err);
            res.send(users.length > 0 ? users : []);
        });
    }

    static get (req, res, next) {
        if(req.params.userId) {
            User.findOne({"_id": req.params.userId}, (err, user) => {
                req.user = user;
                next(err)
            })
        }
        else {
            next(console.log('NO_USER_SPECIFIED', 400));
        }
    }

    static getLoginInfos (req, res, next) {
        if(req.params.userId) {
            User.findOne({"_id": req.params.userId}, (err, user) => {
                req.user = user;
                next(err)
            }).select('_id username +hash +salt attempts lastLogin ip isAdmin');
        }
        else {
            next(console.log('NO_USER_SPECIFIED', 400));
        }
    }

    static getPersonalInfos (req, res, next) {
        if(req.params.userId) {
            User.findOne({"_id": req.params.userId}, (err, user) => {
                req.user = user;
                next(err)
            }).select('_id firstname lastname phone lang birthdate creationDate');
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