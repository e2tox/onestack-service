'use strict';

/**
 * Module dependencies.
 */


module.exports = function (request, reply) {

    // overriding the HTTP Method
    var override = request.headers['x-http-method-override'];
    if (override) {
        request.setMethod(override);
        request.log(['GEN', 'SGEN0303'], { 'x-http-method-override': override });
    }

    // continue process request, breaking change from HAPI
    reply.continue();

};
