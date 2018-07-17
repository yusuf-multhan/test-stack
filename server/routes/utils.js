const mongoose = require('mongoose');
const _ = require('lodash');
const AltexSchema = mongoose.model('AltexSchema');
const HitBTCSchema = mongoose.model('HitBTCSchema');
const TradesatoshiSchema = mongoose.model('TradesatoshiSchema');
const TradeogreSchema = mongoose.model('TradeogreSchema');
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
        case 'tradesatoshi' : return 'TradeogreSchema';
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
                last: res.data[v]['last'] && Number(res.data[v]['last']).noExponents(),
                bid: res.data[v]['bid'] && Number(res.data[v]['bid']).noExponents(),
                ask: res.data[v]['ask'] && Number(res.data[v]['ask']).noExponents(),
                high: res.data[v]['high24'] && Number(res.data[v]['high24']).noExponents(),
                low: res.data[v]['low24'] && Number(res.data[v]['low24']).noExponents(),
                change: v['change'] && Number(v['change']).noExponents()
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
                volume: v['volumeQuote'] && Number(v['volumeQuote']).noExponents(),
                last: v['last'] && Number(v['last']).noExponents(),
                bid: v['bid'] && Number(v['bid']).noExponents(),
                ask: v['ask'] && Number(v['ask']).noExponents(),
                high: v['high'] && Number(v['high']).noExponents(),
                low: v['low'] && Number(v['low']).noExponents()
            }
        })
        HitBTCSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.tradeogreIteration = (exObj, res) => {
    let arrList = [];
    if (res && res.length) {
         _.forEach(res, (v) => {
            let symbol = Object.keys(v);
            let tmp =  {
                symbol: symbol[0].replace('-', '_'),
                volume: v[symbol[0]]['volume'] && Number(v[symbol[0]]['volume']).noExponents(),
                last: v[symbol[0]]['price'] && Number(v[symbol[0]]['price']).noExponents(),
                bid: v[symbol[0]]['bid'] && Number(v[symbol[0]]['bid']).noExponents(),
                ask: v[symbol[0]]['ask'] && Number(v[symbol[0]]['ask']).noExponents(),
                high: v[symbol[0]]['high'] && Number(v[symbol[0]]['high']).noExponents(),
                low: v[symbol[0]]['low'] && Number(v[symbol]['low']).noExponents()
            }
            arrList.push(tmp);
        })
        TradeogreSchema.insertMany(arrList, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.tradesatoshiIteration = (exObj, res) => {
    if(res && res.success == true){
        let arrDoc = _.map(res.result, (v) => {
            return {
                symbol: v['market'],
                volume: v['volume'] && Number(v['volume']).noExponents(),
                last: v['last'] && Number(v['last']).noExponents(),
                bid: v['bid'] && Number(v['bid']).noExponents(),
                ask: v['ask'] && Number(v['ask']).noExponents(),
                high: v['high'] && Number(v['high']).noExponents(),
                low: v['low'] && Number(v['low']).noExponents(),
                change: v['change'] && Number(v['change']).noExponents()
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
                volume: v['quoteVolume'] && Number(v['quoteVolume']).noExponents(),
                last: v['last'] && Number(v['last']).noExponents(),
                bid: v['bid'] && Number(v['bid']).noExponents(),
                ask: v['ask'] && Number(v['ask']).noExponents(),
                high: v['high'] && Number(v['high']).noExponents(),
                low: v['low'] && Number(v['low']).noExponents(),
                change: v['percentChange'] && Number(v['percentChange']).noExponents()
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
                volume: v['BuyBaseVolume'] && Number(v['BuyBaseVolume']).noExponents(),
                last: v['LastPrice'] && Number(v['LastPrice']).noExponents(),
                bid: v['BidPrice'] && Number(v['BidPrice']).noExponents(),
                ask: v['AskPrice'] && Number(v['AskPrice']).noExponents(),
                high: v['High'] && Number(v['High']).noExponents(),
                low: v['Low'] && Number(v['Low']).noExponents(),
                change: v['Change'] && Number(v['Change']).noExponents()
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
                volume: v['quoteVolume'] && Number(v['quoteVolume']).noExponents(),
                last: v['lastPrice'] && Number(v['lastPrice']).noExponents(),
                bid: v['bidPrice'] && Number(v['bidPrice']).noExponents(),
                ask: v['askPrice'] && Number(v['askPrice']).noExponents(),
                high: v['highPrice'] && Number(v['highPrice']).noExponents(),
                low: v['lowPrice'] && Number(v['lowPrice']).noExponents(),
                change: v['priceChangePercent'] && Number(v['priceChangePercent']).noExponents()
            }
        })
        BinanceSchema.insertMany(arrDoc, function (err, mongooseDoc) {
            if (err) return console.log('Error while insert into exchange ' + exObj.name + err.message);
        })
    }
}

exports.exchangeSchemaMapping = exchangeSchemaMapping;