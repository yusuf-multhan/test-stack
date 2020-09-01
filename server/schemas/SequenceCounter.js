const mongoose = require('mongoose');
const getDefaultSchema = () => {
    return new mongoose.Schema({
        seqValue: {
            type: Number,
            required: true
        },
        createdTimestamp : {type : Date, default : Date.now()}
    });
}


mongoose.model('SequenceCounter', getDefaultSchema(), 'sequenceCounter');