'use strict';


var util = require('util');


module.exports = function (request, event, tags) {

    // add transaction logs into request details
    if (tags.ASG) {

        var level = tags.error ? 'error' : (tags.warn ? 'warn' : 'debug');
        var subject = util.format('%s:%s', request.info.remoteAddress, request.info.remotePort);
        var detail = {
            time: event.timestamp - request.info.received,
            code: event.tags[1]
        };
        if (event.data) {
            detail.meta = event.data;
        }

        if (request.statistics && request.statistics.details) {
            request.statistics.details.push(detail);
        }

        // log
        request.server.app.kernel.log(level, subject, detail);

        // TODO: raise event
        // request.server.app.emit(detail.code, request, detail.meta);
    }
    else if (tags.received && event.data) {

        console.log('%s \x1B[32m%s\x1B[39m %s%s', request.info.remoteAddress, event.data.method, request.server.info.uri, event.data.url);

    }

};
