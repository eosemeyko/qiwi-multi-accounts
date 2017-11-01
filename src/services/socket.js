const Server = require('socket.io'),
    debug = require('debug')('qiwi-balances:socket');

// Services
const memory = require('./memory');

module.exports = {
    connection: null,

    /**
     * Connection WebSocket and listen events
     * @param server
     */
    connect: (server) => {
        const io = new Server(server);
        this.connection = io;
        io.on('connection', (socket) => {
            debug('new connection ' + socket.id);

            const data = memory.get('Data');
            if(data) socket.emit('Data', data);
        });
    },
    /**
     * Send All Users Event Data
     * @param event
     * @param data
     */
    sendAll: (event, data) => {
        if (!event) return false;
        this.connection.sockets.emit(event, data || {});
    }
};