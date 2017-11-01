const _ = require('lodash'),
    debug = require('debug')('qiwi-balances:qiwi'),
    request = require('request'),
    urlJoin = require('url-join');

/**
 * REQUEST CLIENT TO QIWI API
 * @param {number} token
 * @returns {*}
 */
module.exports = function (token) {
    // REQUESTS
    return {
        /**
         * Get User Balance
         * @returns {Promise}
         */
        getBalance: () => {
            return _sendRequest('GET', 'funding-sources/v1/accounts/current');
        }
    };

    /**
     * Create request uri from API host address and passed path
     * @param {string} path
     * @private
     */
    function _createRequestUri(path) {
        return urlJoin('https://edge.qiwi.com/', path);
    }

    /**
     * Create request option
     * @param method
     * @param data
     * @private
     */
    function _createRequestOptions(method, data) {
        let result = {
            method: method,
            form: data || {}
        };

        // Bearer token
        result.auth = {bearer: token};

        // Return
        return result;
    }

    /**
     * Send request to API server
     * @param {string} method Request method
     * @param {string} [path] Repository API path
     * @param {Object} [data] Request data
     * @private {Promise.<Object|Array,Error>} Response object (or array) if fulfilled or Error if rejected
     */
    function _sendRequest(method, path, data) {
        const requestUri = _createRequestUri(path),
            requestOptions = _createRequestOptions(method, data);

        return new Promise((resolve, reject) => {
            let logData = _.extend({}, requestOptions || {});
            if (logData.headers) delete logData.headers;
            debug(requestUri + ' Options: ' + JSON.stringify(logData));

            return request(requestUri, requestOptions, (err, response, body) => {
                if (err) {
                    console.log(err);
                    return reject();
                }

                try {
                    body = JSON.parse(body)
                } catch(e) {
                    return reject();
                }

                resolve(body);
            });
        });
    }
};
