'use strict';

/**
 * Module dependencies.
 */


// customize the response object
var ResponseFormatter = require('../../responseFormatter');


module.exports = function (request, reply) {

    var response;

    // Response from upstream is an Error object coming from middleware or network interface or authentication
    if (request.response instanceof Error) {

        var err = request.response;

        if (err.isBoom) {
            response = ResponseFormatter.format(request, 'EGEN9302', err.output.payload);
        }
        else if (err.code === 'ETIMEDOUT') {
            response = ResponseFormatter.format(request, 'EGEN9303', err);
        }
        else if (err.code === 'EAGAIN') {
            response = ResponseFormatter.format(request, 'EGEN9304', err);
        }
        else if (err.code === 'ECONNREFUSED') {
            response = ResponseFormatter.format(request, 'EGEN9305', err);
        }
        else {
            response = ResponseFormatter.format(request, 'EGEN9306', err);
        }

        // Hacking HAPI response.
        // Why? Hapi is using boom and boom do not support `Accept` header.
        // If the request `Accept: xml`. the error response should return error in xml format. That's it.
        request._setResponse(response);
    }
    else {
        response = request.response;
    }

    // add server info
    response.header('server', 'Genesis/' + request.server.version);

    // continue process request, breaking change from HAPI
    reply.continue();
};
