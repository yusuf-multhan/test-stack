const mongoose = require('mongoose');
const _ = require('lodash');
const AltexSchema = mongoose.model('AltexSchema');
const HitBTCSchema = mongoose.model('HitBTCSchema');

function exchangeSchemaMapping (exchangeName) {
    switch(exchangeName.toLowerCase()) {
        case 'altex' : return 'AltexSchema'
        break;
        case 'hitbtc' : return 'HitBTCSchema'
        break;
        case 'tradeogre' : return '';
        break;
        case 'tradesatoshi' : return '';
        break;
        case 'crex24' : return '';
        break;
        case 'cryptopia' : return '';
        break;
        case 'binance' : return '';
        break;
        default : return '';
        break;
    }
}

exports.altexIteration = (exObj, res) => {
    if (res && res.success == true && res.data) {
        let list = Object.keys(res.data);
        let arrDoc = _.map(list, (v) => {
            return {
                symbol: v,
                volume: res.data[v]['volume'],
                last: res.data[v]['last'],
                bid: res.data[v]['bid'],
                ask: res.data[v]['ask'],
                high: res.data[v]['high24'],
                low: res.data[v]['low24']
            }
        })
        AltexSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.hitbtcIteration = (exObj, res) => {
    if (res && res.length) {
        let arrDoc = _.map(res, (v) => {
            return {
                symbol: v['symbol'],
                volume: v['volume'],
                last: v['last'],
                bid: v['bid'],
                ask: v['ask'],
                high: v['high'],
                low: v['low']
            }
        })
        HitBTCSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.exchangeApiList = (l) => {
    return _.map(l, (v) => {
        return {
            name : v.name,
            url : '/api/' + v.name,
            frequency : v.frequency,
            queryString : {
                symbol : {
                    type : 'String',
                    sampleValue : 'BTC'
                },
                range : {
                    type : 'String',
                    sampleValue : '1531515922-1531512322'
                }
            }   
        }
    })
}

exports.exchangeSchemaMapping = exchangeSchemaMapping;