import './src/models'; // Loading models in Mongoose

import mongoose from 'mongoose';
import express from 'express';

import bodyParser from 'body-parser';
import env from 'dotenv';
env.config();

// session storage
import session from 'express-session';
import FingerPrint from 'express-fingerprint';
import connectMongo from 'connect-mongo';
const mongoStore = connectMongo({session: session});

import Authentication from './src/common/Authentication';
import routes from './src/routes';

const mongoDBOptions = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

const mongoDBAddress = `${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}` || 'terrarium:27017';
const mongoDBName = process.env.MONGODB_NAME || 'terrarium';

const sessionSecretKey = process.env.SESSION_SECRET_KEY || 'co123be456lt789di!$erk?';
if (!sessionSecretKey) {
    log.error("Environment variable SESSION_SECRET_KEY is not defined.");
    process.exit(1);
}

const mongoDbURI = `mongodb://${mongoDBAddress}/${mongoDBName}`;

const db = mongoose.connect(mongoDbURI, mongoDBOptions, err => { if (err) { throw err; } });

const app = express();

mongoose.connection.on('error', console.log.bind(console, 'MongoDB connection error'));
mongoose.connection.once('open', () => {
    const sessionMaxAge = parseInt(process.env.SESSION_MAX_AGE) || 172800000; // 60000 = 1 minute, 172800000 = 2j

    const sessionConfig = {
        secret: sessionSecretKey,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: sessionMaxAge // 60000 = 1 minute
        },
        store: new mongoStore({
            mongooseConnection: mongoose.connection,
            collection: 'sessions'
        })
    };

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(session(sessionConfig));

    app.use(FingerPrint({
        parameters:[
            FingerPrint.useragent,
            FingerPrint.acceptHeaders,
            FingerPrint.geoip,
        ]
    }));

    Authentication.initializePassportAuthentication(app);

    app.use('*', (req, res, next) => {
        const newVisit = {
            date: new Date(),
            page: req.baseUrl
        };

        req.session.fingerprint = req.fingerprint;
        req.session.typeVisitor = req.user ? 'User' : 'Lead/Visitor';
        req.session.lang = req.locale;

        if (req.session.visited)
            req.session.visited.push(newVisit);
        else
            req.session.visited = [newVisit];

        console.log(`[${req.session.typeVisitor}] Session: "${req.sessionID}", Lang: ${req.session.lang}, FingerPrint: "${req.session.fingerprint.hash}", Visits: ${req.session.visited.length}`);
        next();
    });

    app.use('/', routes);

    app.use(express.static('./public'));

    app.use(function (req, res, next) {
        next(console.log(`Cannot ${req.method} ${req.url}`, 404));
    });

    const port = process.env.PORT || 3020;

    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
        console.log(`Environment : ${app.get('env')}`);
        console.log(`Database URL : ${mongoDbURI}`);
        console.log(`Sessions are stored for ${ (sessionMaxAge/60000)>60 ? `${sessionMaxAge/60000/60} hours` : `${sessionMaxAge/60000} minutes`}`);
    })
});
