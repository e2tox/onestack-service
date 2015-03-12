'use strict';

module.exports = function (request, reply) {

    var length = request.headers['content-length'];
    var statistics = request.statistics;

    request.log(['GEN', 'SGEN0001'], { expect: length });

    if (statistics) {

        request.once('disconnect', function () {
            request.log(['GEN', 'EGEN0003'],
                { received: statistics.request.bytes });
        });

        request.on('peek', function (chunk, encoding) {
            if (statistics.request.payload instanceof Buffer) {
                statistics.request.payload = Buffer.concat([statistics.request.payload, chunk]);
            } else {
                statistics.request.payload = chunk;
                statistics.request.encoding = encoding;
            }
            statistics.request.bytes += chunk.length;
            request.log(['GEN', 'SGEN0004'],
                { received: statistics.request.bytes, chunk: chunk.length, expect: length });
        });

        request.once('finish', function () {
            request.log(['GEN', 'SGEN0005'],
                { received: statistics.request.bytes, expect: length });
        });

    }

    // overriding the HTTP Method
    var override = request.headers['x-http-method-override'];
    if (override) {
        request.setMethod(override);
        request.log(['GEN', 'SGEN0002'], { 'x-http-method-override': override });
    }

    // continue process request, breaking change from HAPI
    reply.continue();

};
