const express = require('express');
const router = express.Router();
const db = require('./db.js');
const mongoose = require('mongoose');

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/exchangelist', (req, res) => {
    mongoose.connection.db.collection('exchangeList', (e, collection) => {
        if(e) return sendError(e, res);
        collection.find()
                    .toArray()
                    .then(list => {
                        response.data = list;
                        res.json(response); 
                    })
                    .catch((e) => {
                        sendError(err, res);
                    })
    })
});

module.exports = router;