'use strict';


/**
 * Module dependencies.
 */
var Joi = require('joi');


module.exports = function (server) {

    server.route({
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
    });

};
