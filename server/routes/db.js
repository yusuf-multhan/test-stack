require('../schemas/ExchangeSchema.js');
require('../schemas/UserSchema.js');
const mongoose = require('mongoose');
const scheduler = require('./scheduler.js');
const utils = require('./utils');

const dbURI = 'mongodb://localhost:27017/';
mongoose.connect(dbURI, { dbName: '10x', useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
    getExchangeList((e, list) => {
        if(e) return console.log('Error while scheduling ' + e.message);
        scheduler.initializeScheduling(list);
    });
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app termination', function () {
        process.exit(0);
    });
});



const getExchangeList = (cb) => {
    mongoose.connection.db.collection('exchangeList', (e, collection) => {
        if(e) return cb(err);
        collection.find()
            .toArray()
            .then(list => {
                cb(null, list);
            })
            .catch((e) => {
                cb(e);
            })
    })
}

exports.getExchangeList = getExchangeList;

const updateFrequency = (opt, cb) => {
    mongoose.connection.db.collection('exchangeList', (e, collection) => {
        collection.updateOne
        collection.update({ name : opt.exchangeName}, { $set : { frequency : opt.reqBody.frequency }}, (e, res) => {
            if(e) return cb(e);
            cb(null, true);
        })
    })
}

exports.updateFrequency = updateFrequency;

const getExchangeData = (opt, cb) => {
    let filter = {}, to, from;
    if(opt.qs) {
        if(opt.qs.range) {
            let a = opt.qs.range.split('-');
            from = new Date(Number(a[0])), to = new Date(Number(a[1]));
            filter.createdTimestamp = {
                "$lte" : to,
                "$gt" : from
            }
            // filter.createdTimestamp = new Date(2018, 6, 17);
        }
        if(opt.qs.cur) {
            filter.symbol = new RegExp(opt.qs.cur, 'i');
        }
    }
    
    let Model = mongoose.model(utils.exchangeSchemaMapping(opt.exchangeName));
    Model.find(filter, (err, res) => {
        if(err) return cb(err, res);
        cb(null, res)
    })
}

exports.getExchangeData = getExchangeData;