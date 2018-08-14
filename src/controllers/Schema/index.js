import mongoose from 'mongoose';
import models from '../../models';

class SchemaController {

    static initialize(req, res, next) {
        req.schemas = {};
        next();
    }

    static getAll (req, res, next) {
        mongoose.connection.db.listCollections().toArray((error, collections) => {
            // console.log('collections', collections);
            collections.map(collection => {
                const schemaName = collection.name.charAt(0).toUpperCase() + collection.name.slice(1);
                if (models[schemaName] !== undefined) {
                    console.log('ok');
                }
                // try {
                // }
                // catch (err) {
                //     return console.error(err);
                // }
            });
        });

        next();
    }

    static send(req, res) {
        res.send(req.schemas);
    }
}

export default SchemaController;