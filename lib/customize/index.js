'use strict';


module.exports = function(server) {

    // server lifecycle
    // =============================
    // server.on('log', require('./onServerLog'));

    // request lifecycle
    // =============================
    server.ext('onRequest', require('./logging/onRequestBegin'));
    // ext: onPreAuth
    // ext: onPostAuth
    // ext: onPreHandler
    // ext: onPostHandler
    server.ext('onPreResponse', require('./logging/onRequestComplete'));

    // event: response
    server.on('request', require('./logging/onLogging'));
    server.on('request-internal', require('./logging/onInternalLogging'));
    server.on('request-error', require('./logging/onRequestError'));
    // event: response
    //server.on('response', require('./logging/onResponseSent'));
    // event: tail
    //server.on('tail', require('./logging/onRequestEnd'));

};
