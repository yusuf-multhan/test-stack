const express = require('express');
const router = express.Router();
const db = require('./db.js');
const mongoose = require('mongoose');
const utils = require('./utils.js');
const config = require('../config/default.json');
const jwt = require('express-jwt');
const passport = require('passport');
const auth = jwt({
    secret: config.secretKey,
    userProperty: 'payload'
});


// User Schema
const User = mongoose.model('User');

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Login API
router.post('/login', (req, res) => {
    passport.authenticate('local', function (err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token,
                "role" : user.role,
                "name" : user.name
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
})

// Authorization API
router.get('/profile', auth, (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json(user);
            });
    }
})

// Get users
router.get('/exchangelist', (req, res) => {
    db.getExchangeList((err, list) => {
        if (err) return sendError(e, res);
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
    db.updateFrequency({ exchangeName, reqBody }, (e, status) => {
        if (e) return sendError(e, res);
        res.json({
            status: 'OK'
        })
    })
});

router.get('/exchange/:exchangeName', (req, res) => {
    let exchangeName = req.params.exchangeName && req.params.exchangeName.toLowerCase() || '';
    if (!exchangeName) return sendError(new Error('Mandatory exchange name param required'), res);

    db.getExchangeData({ exchangeName }, (err, exchangeResponse) => {
        let response = {
            status: 200,
            data: {},
            message: 'OK'
        };
        if (err) return sendError(e, res);
        response.data = exchangeResponse;
        res.json(response);
    })
})

module.exports = router;