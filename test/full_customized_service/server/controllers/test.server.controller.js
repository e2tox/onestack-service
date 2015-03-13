'use strict';


/**
 * Module dependencies.
 */
var Joi = require('joi');


module.exports = function (server) {

    // Add the route
    server.route({
        method: 'GET',
        path: '/api/v1/test',
        handler: function (request, reply) {
            reply('up');
        },
        config: {
            description: 'Get server status',
            //notes: 'Returns a todo item by the id passed in the path',
            tags: ['api']
            //validate: {
            //    params: {
            //        username: Joi.number().required().description('the id for the todo item')
            //    }
            //}
        }
    });

    server.route({
        method: 'POST',
        path: '/api/v1/test',
        handler: function (request, reply) {
            //throw new Error('hahaha');
            reply('up');
        },
        config: {
            description: 'Get server status',
            //notes: 'Returns a todo item by the id passed in the path',
            tags: ['api']
            //validate: {
            //    params: {
            //        username: Joi.number().required().description('the id for the todo item')
            //    }
            //}
        }
    });
};
