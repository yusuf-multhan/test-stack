const express = require('express');
const router = express.Router();
const db = require('./db.js');
const mongoose = require('mongoose');
const utils = require('./utils.js');

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Get users
router.get('/exchangelist', (req, res) => {
    db.getExchangeList((err, list) => {
        if(err) return sendError(e, res);
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: 'OK'
        };
        response.data = utils.exchangeApiList(list);
        res.json(response);
    })
});

router.put('/exchangelist/frequency/:exchangeName', (req, res) => {
    let exchangeName = req.params.exchangeName && req.params.exchangeName.toLowerCase();
    let reqBody = req.body;
    db.updateFrequency({exchangeName, reqBody}, (e, status) => {
        if(e) return sendError(e, res);
        res.json({
            status : 'OK'
        })
    })
});

router.get('/:exchangeName', (req, res) => {
    let exchangeName = req.params.exchangeName && req.params.exchangeName.toLowerCase() || '';
    if(!exchangeName) return sendError(new Error('Mandatory exchange name param required'), res);

    db.getExchangeData({exchangeName}, (err, exchangeResponse) => {
        let response = {
            status: 200,
            data: {},
            message: 'OK'
        };
        if(err) return sendError(e, res);
        response.data = exchangeResponse;
        res.json(response);
    })
})

module.exports = router;