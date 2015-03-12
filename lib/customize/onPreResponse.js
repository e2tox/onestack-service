'use strict';

// customize the response object
var ResponseFormatter = require('../responseFormatter');


module.exports = function (request, reply) {

    var response, tail = request.tail(), statistics = request.statistics;

    request.log(['ASG', 'SASG9201']);


    // Response from upstream is an Error object coming from middleware or network interface or authentication
    if (request.response instanceof Error) {

        var err = request.response;

        if (err.isBoom) {
            response = ResponseFormatter.format(request, 'EASG9202', err.output.payload);
        }
        else if (err.code === 'ETIMEDOUT') {
            response = ResponseFormatter.format(request, 'EASG9203', err);
        }
        else if (err.code === 'EAGAIN') {
            response = ResponseFormatter.format(request, 'EASG9204', err);
        }
        else if (err.code === 'ECONNREFUSED') {
            response = ResponseFormatter.format(request, 'EASG9205', err);
        }
        else {
            response = ResponseFormatter.format(request, 'EASG9206', err);
        }

        statistics.error = { message: err.message, stack: err.stack, data: err.data, raw: err };

    }
    else {
        request.log(['ASG', 'SASG9207']);
        response = request.response;
    }

    // log response variety: plain, buffer, view, file, stream
    statistics.response.variety = response.variety;

    // add server info
    response.header('Server', statistics.server.name + '/' + statistics.server.version);

    // peek
    response.on('peek', function (chunk, encoding) {
        if (statistics.response.payload instanceof Buffer) {
            statistics.response.payload = Buffer.concat([statistics.response.payload, chunk]);
        }
        else {
            statistics.response.payload = chunk;
            statistics.response.encoding = encoding;
        }
        request.log(['ASG', 'SASG0011'], { sent: statistics.response.payload.length, chunk: chunk.length });
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

        request.log(['ASG', 'SASG0012'], { sent: sent });

        tail();
    });

    request.log(['ASG', 'SASG0010']);

    // continue process request, breaking change from HAPI
    reply.continue();
};
