'use strict';

/**
 * Module dependencies.
 */


module.exports = function (request, err) {
    request.log(['GEN', 'EGEN9399', 'ERROR'], {
        message: err.message,
        stack: err.stack
    });
};
