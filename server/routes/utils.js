const mongoose = require('mongoose');
const _ = require('lodash');
const AltexSchema = mongoose.model('AltexSchema');
const HitBTCSchema = mongoose.model('HitBTCSchema');
const TradesatoshiSchema = mongoose.model('TradesatoshiSchema');
const Crex24Schema = mongoose.model('Crex24Schema');
const CryptopiaSchema = mongoose.model('CryptopiaSchema');
const BinanceSchema = mongoose.model('BinanceSchema');

function exchangeSchemaMapping (exchangeName) {
    switch(exchangeName.toLowerCase()) {
        case 'altex' : return 'AltexSchema'
        break;
        case 'hitbtc' : return 'HitBTCSchema'
        break;
        case 'tradeogre' : return 'TradesatoshiSchema';
        break;
        case 'tradesatoshi' : return '';
        break;
        case 'crex24' : return 'Crex24Schema';
        break;
        case 'cryptopia' : return 'CryptopiaSchema';
        break;
        case 'binance' : return 'BinanceSchema';
        break;
        default : return '';
        break;
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

exports.altexIteration = (exObj, res) => {
    if (res && res.success == true && res.data) {
        let list = Object.keys(res.data);
        let arrDoc = _.map(list, (v) => {
            return {
                symbol: v,
                volume: res.data[v]['volume'],
                last: res.data[v]['last'] && res.data[v]['last'].toString(),
                bid: res.data[v]['bid'] && res.data[v]['bid'].toString(),
                ask: res.data[v]['ask'] && res.data[v]['ask'].toString(),
                high: res.data[v]['high24'] && res.data[v]['high24'].toString(),
                low: res.data[v]['low24'] && res.data[v]['low24'].toString(),
                change: v['change'] && v['change'].toString()
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
                volume: v['volumeQuote'] && v['volumeQuote'].toString(),
                last: v['last'] && v['last'].toString(),
                bid: v['bid'] && v['bid'].toString(),
                ask: v['ask'] && v['ask'].toString(),
                high: v['high'] && v['high'].toString(),
                low: v['low'] && v['low'].toString()
            }
        })
        HitBTCSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.tradesatoshiIteration = (exObj, res) => {
    if(res && res.success == true){
        let arrDoc = _.map(res.result, (v) => {
            return {
                symbol: v['market'],
                volume: v['volume'] && v['volume'].toString(),
                last: v['last'] && v['last'].toString(),
                bid: v['bid'] && v['bid'].toString(),
                ask: v['ask'] && v['ask'].toString(),
                high: v['high'] && v['high'].toString(),
                low: v['low'] && v['low'].toString(),
                change: v['change'] && v['change'].toString()
            }
        })
        TradesatoshiSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.crex24Iteration = (exObj, res) => {
    if(res && res.length){
        let arrDoc = _.map(res, (v) => {
            return {
                symbol: v['instrument'].replace('-', '_'),
                volume: v['quoteVolume'] && v['quoteVolume'].toString(),
                last: v['last'] && v['last'].toString(),
                bid: v['bid'] && v['bid'].toString(),
                ask: v['ask'] && v['ask'].toString(),
                high: v['high'] && v['high'].toString(),
                low: v['low'] && v['low'].toString(),
                change: v['percentChange'] && v['percentChange'].toString()
            }
        })
        Crex24Schema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.cryptopiaIteration = (exObj, res) => {
    if(res && res.success == true){
        let arrDoc = _.map(res.result, (v) => {
            return {
                symbol: v['Label'].replace('/','_'),
                volume: v['BuyBaseVolume'] && v['BuyBaseVolume'].toString(),
                last: v['LastPrice'] && v['LastPrice'].toString(),
                bid: v['BidPrice'] && v['BidPrice'].toString(),
                ask: v['AskPrice'] && v['AskPrice'].toString(),
                high: v['High'] && v['High'].toString(),
                low: v['Low'] && v['Low'].toString(),
                change: v['Change'] && v['Change'].toString()
            }
        })
        CryptopiaSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.binanceIteration = (exObj, res) => {
    if(res && res.length){
        let arrDoc = _.map(res, (v) => {
            return {
                symbol: v['symbol'],
                volume: v['quoteVolume'] && v['quoteVolume'].toString(),
                last: v['lastPrice'] && v['lastPrice'].toString(),
                bid: v['bidPrice'] && v['bidPrice'].toString(),
                ask: v['askPrice'] && v['askPrice'].toString(),
                high: v['highPrice'] && v['highPrice'].toString(),
                low: v['lowPrice'] && v['lowPrice'].toString(),
                change: v['priceChangePercent'] && v['priceChangePercent'].toString()
            }
        })
        BinanceSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.exchangeSchemaMapping = exchangeSchemaMapping;