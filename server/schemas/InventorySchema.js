const mongoose = require('mongoose');
const getDefaultSchema = () => {
    return new mongoose.Schema({
        material: {
            type: String,
            required: true
        },
        variant: {
            type: String,
            required: true
        },
        availableBalance: {
            type: Number,
            required: true
        },
        inQuantity: Number,
        outQuantity: Number,
        createdTimestamp : {type : Date, default : Date.now()}
    });
}


mongoose.model('Inventory', getDefaultSchema(), 'inventory');