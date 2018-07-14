const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const http = require('http');
const app = express();

const passport = require('passport');
const api = require('./server/routes/api');


// Setting Passport strategy
require('./server/routes/passportSetup');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(cors());

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/tenx')));

// Initialize passport before setting routes
app.use(passport.initialize());

// API location
// API file for interacting with MongoDB
app.use('/api', function mw(req, res, next) {
    console.log('came here');
    next();
}, api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/tenx/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

process.on('uncaughtException', (e) => {
    console.log('Uncaught Exception in node process : ' + e.message);
})

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));