'use strict';

/**
 * Module dependencies.
 */

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
};
