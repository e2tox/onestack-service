'use strict';


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
        path: '/api/v1/throw',
        handler: function (request, reply) {
            reply('done');
        },
        config: {
            description: 'Get server status',
            tags: ['api']
        }
    });
};
