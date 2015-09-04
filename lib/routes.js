'use strict';


/**
 * Module dependencies.
 */

var path        = require('path'),
    Boom        = require('boom');

exports.LoadServerRoutes = function(server, kernel) {

    var settings = kernel.settings;

    // load route from server/routes
    var routes = require('./utils').getGlobbedFiles([
            path.join(settings.HOME_DIR, 'server/routes/*.server.route.js'),
            path.join(settings.HOME_DIR, 'server/routes/**/*.server.route.js')]
    );

    if (routes.length) {
        kernel.debug('Detected ' + routes.length + ' routes(s)', routes);
    }

    routes.forEach(function (route) {
        try {
            require(route)(server, Boom);
        }
        catch (err) {
            kernel.error('Error loading route: ' + route, { message: err.message });
            throw err;
        }
    });

    if (routes.length) {
        kernel.info('Successful load %s route(s)', routes.length);
    }
    else {
        kernel.info('No route detected', routes.length);
    }


};

