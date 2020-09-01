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
        customerDetails: {
            name: String,
            address: String,
            phone: String
        }
    });
}


mongoose.model('Order', getDefaultSchema(), 'order');