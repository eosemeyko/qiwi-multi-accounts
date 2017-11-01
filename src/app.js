/* Dependencies */
const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

/**
 * GLOBAL TYPE
 * @typedef {Function} express
 * @typedef {Function} express.use
 * @typedef {Function} express.engine
 * @typedef {Function} express.set
 * @typedef {Function} express.get
 * @type {express}
 */
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* DEBUG */
if(process.env.DEBUG) app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../web/public')));

/**
 * ROUTES
 * */
const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;