import passportLocalMongoose from 'passport-local-mongoose';
import mongoose from 'mongoose';
import moment from 'moment';

const Schema = mongoose.Schema;

const UserSchema = Schema ({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },

    safetyCode: {
        type: Number,
    },

    salt: { // Password (1/2)
        type: String,
        required: true,
    },
    hash: { // Password (2/2)
        type: String,
        required: true,
    },

    email: {
        type: String,
    },

    firstname: {
        type: String,
        default: 'John',
    },

    lastname: {
        type: String,
        default: 'Doe',
    },

    phone: {
        type: String, // pour les "->0<-6..."
    },

    lang: {
        type: String,
        default: 'fr',
    },

    lastLogin: {
        type: Date,
    },

    attempts: {
        type: Number,
        default: 0,
    },

    birthdate: {
        type: Date,
    },

    ip: {
        type: String,
    },

    isAdmin: {
        type: Boolean,
        default: 0,
    },

    creationDate: {
        type: Date,
        default: moment(),
    }
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: "username",
    usernameUnique: true,
    lastLoginField: "lastLogin",
    selectFields: [
        "attempts", // "attempts" is required for limitation
        "username"
    ],
    usernameLowerCase: true,
    encoding: 'hex',
    limitAttempts: true,
    maxAttempts: 5,
    passwordValidator: (password, callback) => {
        if (password.length < 5) {
            return callback({
                status: 400,
                message: "Password should have at least 5 characters"
            });
        }
        callback(null);
    }
});

mongoose.model('User', UserSchema);