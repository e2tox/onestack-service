'use strict';


module.exports = function(server) {

    // server lifecycle
    // =============================
    // server.on('log', require('./onServerLog'));

    // request lifecycle
    // =============================
    // ext: onRequest
    server.ext('onRequest', require('./onRequestBegin'));
    // ext: onPreAuth
    // ext: onPostAuth
    // ext: onPreHandler
    // ext: onPostHandler
    // ext: onPreResponse
    server.ext('onPreResponse', require('./onPreResponse'));
    // event: response
    server.on('request', require('./onRequestLog'));
    // event: internalError
    server.on('request-error', require('./onRequestError'));
    // event: response
    // server.on('response', require('./onResponseSent'));
    // event: tail
    server.on('tail', require('./onRequestEnd'));

};
