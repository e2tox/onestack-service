'use strict';

var _ = require('lodash'),
    Response = require('../response');


module.exports = function(server, options) {

    return {

        payload: function(request, next) {
            request.log(['ASG', 'SASG1001']);
            // if failed   request.log(['ASG', 'SASG1002']);
            request.log(['ASG', 'SASG1003']);
            next();
        },
        response: function(request, next) {
            request.log(['ASG', 'SASG1004']);
            // if failed   request.log(['ASG', 'SASG1005']);
            request.log(['ASG', 'SASG1006']);
            next();
        },
        authenticate: function(request, reply) {

            var tenant, app = request.server.app, response;

            request.log(['ASG', 'SASG1007']);

            // require username/password check
            if (app.security.authenticate) {

                request.log(['ASG', 'SASG1008']);

                if (!request.headers.authorization) {
                    return Response.end(request, reply, 'EASG1009', { require: 'authorization', headers: request.headers });
                }

                request.log(['ASG', 'SASG1010']);

                var schema = request.headers.authorization.split(' ');
                if (schema.length !== 2 || schema[0] !== 'Basic') {
                    return Response.end(request, reply, 'EASG1011', { type: schema[0], schema: schema });
                }

                request.log(['ASG', 'SASG1012']);

                var credentials = new Buffer(schema[1], 'base64').toString('ascii').split(':');
                if (credentials.length !== 2) {
                    return Response.end(request, reply, 'EASG1013', { type: schema[0], schema: schema });
                }

                request.log(['ASG', 'SASG1014']);

                tenant = _.find(app.tenants, function(tenant) {
                    return tenant.key === credentials[0] && tenant.token === credentials[1];
                });

                if (!tenant) {
                    return Response.end(request, reply, 'EASG1015', { key: tenant.key, token: tenant.token });
                }

                request.log(['ASG', 'SASG1016']);

                // TODO: check tenant block flag, if have
                // if (check failed) {
                //   return Response.end(request, reply, 'EASG1017', { key: tenant.key });
                // }

                request.log(['ASG', 'SASG1018']);
            }

            if (app.security.authenticate) {
                // authentication success
                request.log(['ASG', 'SASG1019']);
                return reply(null, { credentials: tenant });
            }
            else if (app.tenants.length) {
                // authenticated anonymous user as first tenant
                request.log(['ASG', 'SASG1020']);
                return reply(null, { credentials: app.tenants[0] });
            }
            else {
                // you need at least one tenant
                return Response.end(request, reply, 'EASG1021');
            }

        }

    };

};
