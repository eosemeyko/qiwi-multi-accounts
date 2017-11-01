/**
 * Dependencies
 */
const debug = require('debug')('qiwi-balances:server'),
    http = require('http'),
    argv = require('optimist').argv;

/* CONFIG */
const config = require('../config/default');

/**
 * Modules APP
 */
const app = require('../src/app'),
    getBalances = require('../src/get-balances'),
    socket = require('../src/services/socket');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(argv.port && !isNaN(Number(argv.port)) ? argv.port : config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * WebSocket start
 */
socket.connect(server);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address(),
        bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Open browser and url');
    console.log('http://localhost' + (addr.port !== 80 ? ':'+addr.port : ''));

    // Start Check balances
    getBalances.start();
}