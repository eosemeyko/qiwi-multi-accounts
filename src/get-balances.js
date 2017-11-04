const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    debug = require('debug')('qiwi-balances:get-balances');

/* CONFIG */
const config = require('../config/default');

/* FILE PATH */
const file = path.join(config.file);

// Services
const qiwi = require('./services/qiwi'),
    socket = require('./services/socket'),
    memory = require('./services/memory');

module.exports = {
    start: function() {
        debug('start ---');
        GetFile();
    }
};

/**
 * Get File And request
 */
function GetFile() {
    debug('get request');
    let data = [];

    /* GET FILE DATA */
    fs.readFile(file, 'utf8', (err, fd) => {
        if (err) return debug(err);

        try {
            data = JSON.parse(fd);
        } catch (e) {
            return debug('error parse file')
        }

        if(_.isEmpty(data) || !_.isArray(data)) return debug('empty file accounts');

        // OPERATION
        let result = [];
        async.each(data, function (account,callback) {
            GetBalance(account.token).then(res => {
                if(res) result.push({
                    login: account.login,
                    token: account.token,
                    balance: Math.round(res)
                });
                callback()
            });
        }, () => {
            if(_.isEmpty(result)) return;
            // Post all browsers
            socket.sendAll('Data', result);
            // Save memory
            memory.set('Data', result);
        })
    });
}

/**
 * Get Balance User Function
 * @param token
 * @returns {Promise}
 * @constructor
 */
function GetBalance(token) {
    return new Promise((resolve) => {
        if(!token) return resolve();

        // Request get balance
        qiwi(token).getBalance()
            .then(res => {
                if(_.isEmpty(res.accounts)) return resolve();
                const result = _.find(res.accounts, 'balance');
                resolve(result.balance.amount);
            })
            .catch(err => {
                debug(err);
                resolve();
            })
    });
}