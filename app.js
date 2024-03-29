var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var session = require('cookie-session');
model = require('models');

var match = require('./routes/Match/match');
var selectPlayers = require('./routes/Match/selectPlayers');
var admin = require('./routes/admin');
var market = require('./routes/Market/marketPlace');
var login = require('./routes/login');
var arena = require('./routes/Arena/arena');
var leaderboard = require('./routes/leaderboard');
var bonus = require('./routes/bonus');
var app = express();
app.use(session({
    secret:'PragyanPremierLeague',
    name:'PragyanPremierLeague'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/Match/selectPlayers',selectPlayers);
app.use('/Match/',match);
app.use('/admin',admin);
app.use('/Arena',arena);
app.use('/Market',market);
app.use('/login',login);
app.use('/bonus',bonus);
app.use('/leaderboard',leaderboard)
app.use('/',market);


app.get('/test',function(req,res){
res.render('postmatch',{
                        result:"yolo",
                        LayoutTeam : req.session.team,
                        partials : {
                            layout : 'layout'
                        }
			});

});
app.get('/logout',function(req,res){
   req.session = null;
   res.redirect('/login');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}*/

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
