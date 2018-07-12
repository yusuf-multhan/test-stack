const mongoose = require('mongoose');
const exchangeSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    last: {
        type: Number,
        required: true
    },
    bid: {
        type: Number,
        required: true
    },
    ask: {
        type: Number,
        required: true
    },
    high: {
        type: Number
    },
    low: {
        type: Number
    },
    currentTimestamp : {type : Date, default : Date.now()}
});


mongoose.model('AltexSchema', exchangeSchema, 'altex');