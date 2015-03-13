'use strict';

/**
 * Module dependencies.
 */


module.exports = function(server) {

    var settings = server.app.settings();

    if (settings.DISABLE_PER_REQUEST_LOG) {
        // simple logging
        server.ext('onRequest', require('./logging/simple/onRequestBegin'));
        server.ext('onPreResponse', require('./logging/simple/onRequestComplete'));
        server.on('request', require('./logging/simple/onLogging'));
        server.on('request-error', require('./logging/simple/onRequestError'));
    }
    else {
        // detailed logging
        server.on('request-internal', require('./logging/detailed/onRequest'));
        server.ext('onRequest', require('./logging/detailed/onRequestBegin'));
        server.ext('onPreResponse', require('./logging/detailed/onRequestComplete'));
        server.on('request', require('./logging/detailed/onLogging'));
        server.on('request-error', require('./logging/detailed/onRequestError'));
    }


    // implement status api
    require('./controllers/status.server.controller')(server);

};
