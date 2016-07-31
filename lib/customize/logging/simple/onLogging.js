'use strict';

/**
 * Module dependencies.
 */

var util = require('util');

module.exports = function (request, event, tags) {

    // console.log(util.inspect(request.session, { colors: true, depth: 7 }));
    var subject = util.format('[%s] %s:%s %s %s', event.tags[1],
        request.info.remoteAddress,
        request.info.remotePort,
        (request.method || '').toUpperCase(),
        request.path);

    if (event.tags.length === 2) {
        request.server.app.kernel.log('verbose', subject, event.data || {});
    } else if (tags.INFO) {
        request.server.app.kernel.log('info', subject, event.data || {});
    } else if (tags.WARN) {
        request.server.app.kernel.log('warn', subject, event.data || {});
    } else if (tags.ERROR) {
        request.server.app.kernel.log('error', subject, event.data || {});
    } else {
        request.server.app.kernel.log('debug', subject, event.data || {});
    }

};
