'use strict';

module.exports = function (request, reply) {

    var length = request.headers['content-length'];

    //console.log(request);
    var settings = request.server.app.settings();

    // create session object for per request scope logging
    var statistics = request.statistics = request.statistics || {
        id: request.id,
        received: request.info.received,
        code: request.server.app.code,
        details: [],
        request: {
            timestamp: new Date(),
            remoteAddress: request.info.remoteAddress,
            remotePort: request.info.remotePort,
            host: request.info.host,
            method: (request.method || '').toUpperCase(),
            path: request.path,
            headers: request.headers,
            payload: null,
            bytes: 0
        },
        response: {
            timestamp: null,
            statusCode: null,
            headers: {},
            payload: null,
            bytes: 0
        },
        application: {
            name: settings.TITLE,
            home_dir: settings.HOME_DIR,
            data_dir: settings.DATA_DIR,
            log_dir: settings.LOG_DIR,
            version: settings.VERSION
        },
        server: {
            name: 'Asgard',
            version: request.server.version,
            uri: request.server.info.uri,
            load: request.server.load
        }
    };

    request.log(['ASG', 'SASG0001'], { expect: length });

    request.once('disconnect', function () {
        request.log(['ASG', 'EASG0003'],
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
        request.log(['ASG', 'SASG0004'],
            { received: statistics.request.bytes, chunk: chunk.length, expect: length });
    });

    request.once('finish', function () {
        request.log(['ASG', 'SASG0005'],
            { received: statistics.request.bytes, expect: length });
    });

    request.log(['ASG', 'SASG0002']);

    // overriding the HTTP Method
    var override = request.headers['x-http-method-override'];
    if (override) {
        request.setMethod(override);
    }

    // continue process request, breaking change from HAPI
    reply.continue();

};
