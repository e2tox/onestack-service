'use strict';


/**
 * Module dependencies.
 */

var path        = require('path'),
    Boom        = require('boom');


exports.LoadServerModules = function(server, kernel) {

    var settings = kernel.settings;

    // load module from server/modules
    var modules = require('./utils').getGlobbedFiles([
            path.join(settings.HOME_DIR, 'server/modules/*.server.module.js'),
            path.join(settings.HOME_DIR, 'server/modules/**/*.server.module.js')]
    );

    if (modules.length) {
        kernel.debug('Detected ' + modules.length + ' modules(s)', modules);
    }

    modules.forEach(function (module) {
        try {
            // generate api schema from routes
            server.register({
                    register: require(module),
                    options: require(module).options || {}
                },
                function (err) {
                    if (err) {
                        kernel.error('Failed to load module: ' + err.message);
                    } else {
                        kernel.info('Successful load module');
                    }
                });
        }
        catch (err) {
            kernel.error('Error loading module: ' + module, { message: err.message });
            throw err;
        }
    });

    if (modules.length) {
        kernel.info('Successful load %s module(s)', modules.length);
    }
    else {
        kernel.info('No module detected');
    }


};

