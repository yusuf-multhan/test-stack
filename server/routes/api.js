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
    db.getExchangeList((err, list) => {
        if(err) return sendError(e, res);
        response.data = list;
        res.json(response); 
    })
});

module.exports = router;