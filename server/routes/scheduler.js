const mongoose = require('mongoose');
const schedule = require('node-schedule');
const _ = require('lodash');
const requestHelper = require('./requestHelper');
const utils = require('./utils');

const AltexSchema = mongoose.model('AltexSchema');


const initializeScheduling = (list) => {
    if (!_.isEmpty(list)) {
        _.forEach(list, (v) => {
            scheduleJob(v);
        })
    } else {
        console.log('Nothing to schedule');
    }
}

exports.initializeScheduling = initializeScheduling;

function scheduleJob(exObj) {
    let cronJob = 'm h * * *';
    setCollection(exObj, 0); // Default fetch on server start.
    if(exObj.frequency) {
        let f = exObj.frequency;
        let h = f.indexOf('h') > -1 ? f.substring(f.indexOf('h') -2, f.indexOf('h')) : '';
        let m = f.indexOf('m') > -1 ? f.substring(f.indexOf('h') > -1 ? f.indexOf('h') + 1 : f.indexOf('m') -2 , f.indexOf('m')) : '';
        cronJob = h ? cronJob.replace('h', '*/' + h) : cronJob.replace('h', '*');
        cronJob = m ? cronJob.replace('m', '*/' + m) : cronJob.replace('m', '0D');
        if(h || m) {
            schedule.scheduleJob(cronJob, () => {
                // setCollection(exObj);
            })
        }
    }
}

function exchangeIteration(exObj, res) {
    switch(exObj.name.toLowerCase()) {
        case 'altex' : return utils.altexIteration(exObj, res);
        break;
        case 'hitbtc' : return utils.hitbtcIteration(exObj, res);
        break;
        case 'tradeogre' : return utils.tradeogreIteration(exObj, res);
        break;
        case 'tradesatoshi' : return utils.tradesatoshiIteration(exObj, res);
        break;
        case 'crex24' : return utils.crex24Iteration(exObj, res);
        break;
        case 'cryptopia' : return utils.cryptopiaIteration(exObj, res);
        break;
        case 'binance' : return utils.binanceIteration(exObj, res);
        break;
    }
}

function setCollection(exObj, counter) {
    console.log('setCollection called', exObj.name, counter);
    requestHelper.makeCall({method : 'GET', url : exObj.apiUrl}, (err, res)=> {
        if(err) {
            return (++counter < 3) ? setCollection(exObj, counter) : console.log('After ' + counter + ' ssssssstries Unable to get Exchange data from ' + exObj.name + err.message);
        }
        exchangeIteration(exObj, res);
    });
}