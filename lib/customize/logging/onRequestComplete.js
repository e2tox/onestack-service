'use strict';

// customize the response object
var ResponseFormatter = require('../responseFormatter');


module.exports = function (request, reply) {

    var response, statistics = request.statistics;

    request.log(['GEN', 'SGEN9201'], { error: request.response instanceof Error });

    // Response from upstream is an Error object coming from middleware or network interface or authentication
    if (request.response instanceof Error) {

        var err = request.response;

        if (err.isBoom) {
            response = ResponseFormatter.format(request, 'EGEN9202', err.output.payload);
        }
        else if (err.code === 'ETIMEDOUT') {
            response = ResponseFormatter.format(request, 'EGEN9203', err);
        }
        else if (err.code === 'EAGAIN') {
            response = ResponseFormatter.format(request, 'EGEN9204', err);
        }
        else if (err.code === 'ECONNREFUSED') {
            response = ResponseFormatter.format(request, 'EGEN9205', err);
        }
        else {
            response = ResponseFormatter.format(request, 'EGEN9206', err);
        }

        if (statistics) {
            // append error info
            statistics.error = {
                message: err.message,
                stack: err.stack,
                data: err.data
            };
        }

        // Hacking HAPI response.
        // Why? Hapi is using boom and boom do not support `Accept` header.
        // If the request `Accept: xml`. the error response should return error in xml format. That's it.
        request._setResponse(response);
    }
    else {
        response = request.response;
        request.log(['GEN', 'SGEN9207']);
    }

    if (statistics) {

        // log response variety: plain, buffer, view, file, stream
        statistics.response.variety = response.variety;

        // peek
        response.on('peek', function (chunk, encoding) {
            if (statistics.response.payload instanceof Buffer) {
                statistics.response.payload = Buffer.concat([statistics.response.payload, chunk]);
            }
            else {
                statistics.response.payload = chunk;
                statistics.response.encoding = encoding;
            }
            request.log(['GEN', 'SGEN0011'], { sent: statistics.response.payload.length, chunk: chunk.length });
        });

        // response complete
        response.once('finish', function () {

            statistics.response.timestamp = new Date();
            statistics.response.statusCode = response.statusCode;
            statistics.response.headers = response.headers;

            var sent = 0;
            if (statistics.response.payload) {
                sent = statistics.response.payload.length;
            }

            request.log(['GEN', 'SGEN0012'], { sent: sent });
        });

    }

    // add server info
    response.header('Server', 'Genesis/' + request.server.version);

    // continue process request, breaking change from HAPI
    reply.continue();
};
