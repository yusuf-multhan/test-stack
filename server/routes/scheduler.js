const mongoose = require('mongoose');
const schedule = require('node-schedule');
const _ = require('lodash');
const https = require('https');

const AltexSchema = mongoose.model('AltexSchema');


const initializeScheduling = (list) => {
    if (!_.isEmpty(list)) {
        _.forEach(list, (v) => {
            if (v.name === 'altex') {
                scheduleJob(v);
            }
        })
    } else {
        console.log('Nothing to schedule');
    }
}

exports.initializeScheduling = initializeScheduling;

function scheduleJob(exObj) {
    let f = Number(exObj.frequency);
    setCollection(exObj);
    schedule.scheduleJob('* * ' + f + ' * * *', function () {
        console.log('job ran');
        setCollection(exObj);
    })
}

function setCollection(exObj) {
    let data = '';
    https.get(exObj.apiUrl, (res) => {
        
        res.on('data', (d) => {
            data += d;
        });

        res.on('end', ()=> {
            data = JSON.parse(data);
            if (data && data.success == true && data.data) {
                let list = Object.keys(data.data);
                let arrDoc = _.map(list, (v) => {
                    return {
                        symbol: v,
                        volume: data.data[v]['volume'],
                        last: data.data[v]['last'],
                        bid: data.data[v]['bid'],
                        ask: data.data[v]['ask'],
                        high: data.data[v]['high24'],
                        low: data.data[v]['low24']
                    }
                })
                AltexSchema.insertMany(arrDoc, function (err, mongooseDoc) {
                    if (err) return console.log('Error while insert ' + err.message);
                    console.log(mongooseDoc.status);
                })
            }
        })

    }).on('error', (e) => {
        console.log('Error while fetching data ' + err.message);
    });
}