'use strict';


var util = require('util');

module.exports = function (request, event) {
    if (request.statistics) {
        var detail = {
            time: event.timestamp - request.info.received,
            app: event.tags[0],
            code: event.tags[1]
        };
        if (event.data) {
            detail.meta = event.data;
        }
        request.statistics.trace.push(detail);
    }
    else {
        // console.log(util.inspect(request.session, { colors: true, depth: 7 }));
        var subject = util.format('[%s] %s:%s %s %s', event.tags[1],
            request.info.remoteAddress,
            request.info.remotePort,
            (request.method || '').toUpperCase(),
            request.path);

        request.server.app.kernel.log('verbose', subject, event.data || {});
    }
};
