const mongoose = require('mongoose');
const getDefaultSchema = () => {
    return new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique : true
        },
        createdTimestamp : {type : Date, default : Date.now()}
    });
}


mongoose.model('Material', getDefaultSchema(), 'material');