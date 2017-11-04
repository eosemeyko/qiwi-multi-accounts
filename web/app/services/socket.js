// Socket IO service
UIBalances.factory('socket', function () {
    var socket = io();
    return {
        /**
         * Listen Event
         * @param eventName
         * @param callback
         */
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                callback.apply(socket, arguments);
            });
        },

        /**
         * Send to server
         * @param eventName
         * @param data
         * @param callback
         */
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                if (callback)
                    callback.apply(socket, arguments);
            })
        },

        /**
         * Remove listen events (Array)
         * @param eventsName
         */
        removeListeners: function (eventsName) {
            /* global angular */
            // {Array}
            if(angular.isArray(eventsName))
                return angular.forEach(eventsName,function (event) {
                    socket.off(event);
                });

            // {String}
            socket.off(eventsName);
        }
    };
});