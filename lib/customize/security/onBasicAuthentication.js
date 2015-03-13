//'use strict';
//'use strict';
//
///**
// * Module dependencies.
// */
//
//
//var _ = require('lodash'),
//    Response = require('../../response');
//
//
//module.exports = function(server, options) {
//
//    return {
//
//        payload: function(request, next) {
//            request.log(['GEN', 'SGEN1001']);
//            // if failed   request.log(['GEN', 'SGEN1002']);
//            request.log(['GEN', 'SGEN1003']);
//            next();
//        },
//        response: function(request, next) {
//            request.log(['GEN', 'SGEN1004']);
//            // if failed   request.log(['GEN', 'SGEN1005']);
//            request.log(['GEN', 'SGEN1006']);
//            next();
//        },
//        authenticate: function(request, reply) {
//
//            var tenant, app = request.server.app, response;
//
//            request.log(['GEN', 'SGEN1007']);
//
//            // require username/password check
//            if (app.security.authenticate) {
//
//                request.log(['GEN', 'SGEN1008']);
//
//                if (!request.headers.authorization) {
//                    return Response.end(request, reply, 'EGEN1009', { require: 'authorization', headers: request.headers });
//                }
//
//                request.log(['GEN', 'SGEN1010']);
//
//                var schema = request.headers.authorization.split(' ');
//                if (schema.length !== 2 || schema[0] !== 'Basic') {
//                    return Response.end(request, reply, 'EGEN1011', { type: schema[0], schema: schema });
//                }
//
//                request.log(['GEN', 'SGEN1012']);
//
//                var credentials = new Buffer(schema[1], 'base64').toString('ascii').split(':');
//                if (credentials.length !== 2) {
//                    return Response.end(request, reply, 'EGEN1013', { type: schema[0], schema: schema });
//                }
//
//                request.log(['GEN', 'SGEN1014']);
//
//                tenant = _.find(app.tenants, function(tenant) {
//                    return tenant.key === credentials[0] && tenant.token === credentials[1];
//                });
//
//                if (!tenant) {
//                    return Response.end(request, reply, 'EGEN1015', { key: tenant.key, token: tenant.token });
//                }
//
//                request.log(['GEN', 'SGEN1016']);
//
//                // TODO: check tenant block flag, if have
//                // if (check failed) {
//                //   return Response.end(request, reply, 'EGEN1017', { key: tenant.key });
//                // }
//
//                request.log(['GEN', 'SGEN1018']);
//            }
//
//            if (app.security.authenticate) {
//                // authentication success
//                request.log(['GEN', 'SGEN1019']);
//                return reply(null, { credentials: tenant });
//            }
//            else if (app.tenants.length) {
//                // authenticated anonymous user as first tenant
//                request.log(['GEN', 'SGEN1020']);
//                return reply(null, { credentials: app.tenants[0] });
//            }
//            else {
//                // you need at least one tenant
//                return Response.end(request, reply, 'EGEN1021');
//            }
//
//        }
//
//    };
//
//};
