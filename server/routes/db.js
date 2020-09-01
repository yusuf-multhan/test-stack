require('../schemas/UserSchema.js');
require('../schemas/MaterialSchema.js');
require('../schemas/VariantSchema.js');
require('../schemas/InventorySchema.js');
require('../schemas/OrderSchema.js');
require('../schemas/SequenceCounter.js');

const mongoose = require('mongoose');
const utils = require('./utils.js');

const dbURI = 'mongodb://localhost:27017/';
mongoose.connect(dbURI, { dbName: 'gr-inventory', useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
    const SeqCounter = mongoose.model('SequenceCounter');
    const result = SeqCounter.findById('orderCounter', (err, row) => {
        if (!row) {
            SeqCounter.update({_id: 'orderCounter'},{seqValue: 0}, {upsert: true}, (err, update) => {
                console.log(err, update);
            });
        };
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

function getValueForNextSeq (seqName) {
    const seqDoc = OrderSchema.findByIdAndUpdate(
        seqName,
        {$inc:{seqValue:1}},
        {new: true}
    );
    return seqDoc.seqValue
}

const getResources = (requestResource, cb) => {
    const ResourceModel = mongoose.model(utils.mapSchema(requestResource));
    ResourceModel.find((err, results) => {
        if (err) console.log(err);
        if(results) {
            cb(null, results.map(i => {return i.name}));
        }
    });
}

exports.getResources = getResources;

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