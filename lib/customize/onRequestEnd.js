'use strict';


var util = require('util');


module.exports = function (request) {

    var statistics = request.statistics;
    var code = 'SASG0000';
    if (statistics.details.length) {
        code = statistics.details[statistics.details.length - 1].code || 'SASG9999';
    }

    request.log(['ASG', 'SASG0030'], { statusCode: statistics.response.statusCode });

    // do not log GET request
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

    // log the request
    request.server.app.log(subject, statistics);

};
