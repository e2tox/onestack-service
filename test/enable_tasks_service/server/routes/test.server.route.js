'use strict';

var Boom = require('boom');


/**
 * Module dependencies.
 */

module.exports = function (server) {

    // Add the route
    server.route({
        method: 'GET',
        path: '/api/v1/throw',
        handler: function () {
            throw Error('this is an error');
        },
        config: {
            description: 'Get server status',
            tags: ['api']
        }
    });

    // Add the route
    server.route({
        method: 'GET',
        path: '/api/v1/logs',
        handler: function (request, reply) {
            request.log(['OFS','INFO0001','INFO']);
            request.log(['OFS','INFO0001','WARN']);
            request.log(['OFS','INFO0001','ERROR']);
            reply('done');
        },
        config: {
            description: 'Get server status',
            tags: ['api']
        }
    });

    server.route({
        method: 'GET',
        path: '/api/v1/access_denied',
        handler: function (request, reply) {
            return reply(Boom.unauthorized('Access denied', 'Basic'));
        },
        config: {
            description: 'Get server status',
            tags: ['api', 'login']
        }
    });

    server.route({
        method: 'GET',
        path: '/api/v1/timeout',
        handler: function (request, reply) {
            var err = new Error('Timeout');
            err.code = 'ETIMEDOUT';
            return reply(err);
        },
        config: {
            description: 'Get server status',
            tags: ['api', 'server']
        }
    });
};
