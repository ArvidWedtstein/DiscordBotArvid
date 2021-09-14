
const mongoose = require('mongoose');
const c = require('ansi-colors');
const { password } = require('./config.json')
//const { mongoPath } = require('./config.json');
const mongoPath = require('./config.json').remoteMongoPath
const MongoClient = require('mongodb').MongoClient;
const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;

// Mongo er databasen der alle brukerdataene lagres.
module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useFindAndModify: false,
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
 
    }).then(async () => {
 
    }).catch((err) => {
        console.error('App starting error:', err.stack);
        console.log(err)

    });
    mongoose.Promise = global.Promise;

}   


