'use strict';


/**
 * Module dependencies.
 */

var path = require('path');


module.exports = function (server) {

    server.route([{
        method: 'GET',
        path: '/favicon.ico',
        handler: function (request, reply) {
            reply.file(path.join(__dirname, '../public/favicon.ico'));
        }
    }, {
        method: ['GET', 'POST'],
        path: '/ping',
        handler: function (request, reply) {
            reply('pong');
        },
        config: {
            description: 'Ping the server',
            notes: 'Returns `pong` if server up and running',
            tags: ['ping']
        }
    }]);

};
