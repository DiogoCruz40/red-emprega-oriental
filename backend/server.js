const express = require('express');
const config = require('./config/config');
const mongoose = require('mongoose');
const app = express();
const https = require("https"),
  fs = require("fs");

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  };

var session = require('express-session');

require('./config/db');

// Parsers for POST data
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true
}));

// Cross Origin middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token,id_user, Content-Disposition");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS")
    next()
})

app.use(session({
    secret: 'i4mt4932z2S1<',
    resave: true,
    saveUninitialized: true
  }));

require('./routes')(app);

/*  PASSPORT SETUP  */
const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

var UserSchema = mongoose.model('administrador');

/* PASSPORT LOCAL AUTHENTICATION */

if (process.env.NODE_ENV === 'production') {
  https.createServer(options, app).listen(config.NODEJS_PORT, () => console.log(`RedEmprega app listening on ${config.NODEJS_PORT}!`))
} else {
  app.listen(config.NODEJS_PORT, () => console.log(`RedEmprega app listening on ${config.NODEJS_PORT}!`))
}

