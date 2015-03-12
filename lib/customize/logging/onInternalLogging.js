'use strict';


var util = require('util');

module.exports = function (request, event, tags) {

    if (tags.received) {

        var settings = request.server.app.settings();

        if (settings.DISABLE_PER_REQUEST_LOG) {
            return;
        }

        // create session object for per request scope logging
        request.statistics = {
            id: request.id,
            received: request.info.received,
            code: settings.ID,
            trace: [],
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
                name: settings.NAME || settings.TITLE,
                home_dir: settings.HOME_DIR,
                data_dir: settings.DATA_DIR,
                log_dir: settings.LOG_DIR,
                version: settings.VERSION
            },
            server: {
                name: 'Genesis',
                version: request.server.version,
                uri: request.server.info.uri,
                load: request.server.load
            }
        };
    }

    else if (tags.response) {

        var statistics = request.statistics, code = 'SGEN0000';

        request.log(['GEN', 'SGEN0030'], { statusCode: request.response.statusCode, contentType: request.response.headers['content-type'] });

        if (statistics) {


            if (statistics.trace.length) {
                code = statistics.trace[statistics.trace.length - 1].code || 'SGEN9999';
            }

            // do not log GET resource request
            if (statistics.request.method === 'GET') {
                var contentType = statistics.response.headers['content-type'] || '';
                if (contentType.indexOf('json') < 0 && contentType.indexOf('xml') < 0) {
                    // Business rule: ignore logging resource request
                    return;
                }
            }

            // console.log(util.inspect(request.session, { colors: true, depth: 7 }));
            var subject = util.format('[%s] %s - %s:%s %s %s', code,
                statistics.response.statusCode,
                statistics.request.remoteAddress,
                statistics.request.remotePort,
                statistics.request.method,
                statistics.request.path);

            // logging Buffer will cause winston dump whole memory into log file
            if (statistics.request.payload instanceof Buffer) {
                statistics.request.payload = statistics.request.payload.toString();
            }

            if (statistics.response.payload instanceof Buffer) {
                statistics.response.payload = statistics.response.payload.toString();
            }

            // log the request to request logging server
            request.server.app.kernel.log('verbose', subject, statistics);
        }
    }

};
