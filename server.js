const express = require('express');

const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('flash');

const passport = require('passport');

const container = require('./container');


container.resolve(function(users){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://amin:amin@ds051334.mlab.com:51334/footballkikdb');
    const app = setupExpress();

    function setupExpress(){
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function(){
            console.log('server on port 3000');
        });

        ConfigureExpress(app);

        const router = require('express-promise-router')();
        users.setRouting(router);

         app.use(router);

    }

    

    function ConfigureExpress(app){

        require('./passport/passport-local');
        
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator());
        app.use(session({
            secret : 'thisissecretkey',
            resave: true,
            saveinitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());
    }


});