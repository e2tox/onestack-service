'use strict';


/**
 * Module dependencies.
 */

var path = require('path'),
    Joi = require('joi');


module.exports = function (server) {

    server.route([{
        method: 'GET',
        path: '/{path*}',
        config: {
            handler: {
                directory: {
                    path: [
                        path.join(__dirname, '../public')
                    ],
                    index: false,
                    listing: false
                }
            }
        }
    }, {
        method: ['GET','POST'],
        path: '/api/v1/ping',
        handler: function (request, reply) {
            reply('pong');
        },
        config: {
            description: 'Ping the server',
            notes: 'Returns `pong` if server up and running',
            tags: ['ping']
        }
    }]);

    console.log(server.connections[0]._router.routes.get.routes);
};
