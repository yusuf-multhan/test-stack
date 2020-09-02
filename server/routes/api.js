const express = require('express');
const router = express.Router();
const db = require('./db.js');
const mongoose = require('mongoose');
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
    let response = {};
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
        User.findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json({
                    email: user.email,
                    name: user.name,
                    role: user.role
                });
            });
    }
});

router.get('/resources', auth, (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    const requestResource = req.query.identifier;
    if (!requestResource) {
        res.status(400).json({message: 'Bad Request'})
    } else {
        db.getResources(requestResource, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({message: err.message});
            } else {
                res.status(200).json(results);
            }
        });
    }
});

module.exports = router;