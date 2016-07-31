'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
    Hapi = require('hapi'),
    _ = require('lodash');


var Server = module.exports = function (kernel) {
    var server = this.server = new Hapi.Server(require('./hapi'));
    this.kernel = kernel;
    this.kernel.route = function () {
        server.route.apply(server, arguments);
    };
};


Server.prototype.settings = function () {
    return this.kernel.settings;
};


/**
 * Initialize application with configuration folder
 * @param {string} configPath
 */
Server.prototype.init = function (configPath) {

    var kernel = this.kernel;
    kernel.init(configPath);

    var server = this.server;
    var host = kernel.settings.HOST || '0.0.0.0';
    var port = '' + kernel.settings.PORT + '';

    // Add support to IIS_Node
    if (port.indexOf('\\\\.\\pipe\\') === 0) {
        host = port;
        port = undefined;
    }

    server.connection({
        host: host,
        port: port
    });

    server.app = this;

    // customize the server: enable per request logging
    require('./customize')(server, kernel);

    // customize the server: modules
    require('./modules').LoadServerModules(server, kernel);

    // customize the server: routes
    require('./routes').LoadServerRoutes(server, kernel);

    // customize the server: tasks
    require('./tasks').LoadServerTasks(server, kernel);
};


Server.prototype.start = function (done) {

    if (!this.server) {
        throw Error('Please call init() first');
    }

    var running = false,
        server = this.server,
        kernel = this.kernel;

    // gracefully shutdown server with uncaught exception
    process.on('uncaughtException', function (err) {

        // make sure we close down within 30 seconds
        var poop = setTimeout(function () {
            process.exit(1);
        }, 30000);

        // But don't keep the process open just for that!
        poop.unref();

        // stop the server
        if (running) {
            server.stop(function () {
                kernel.warn('Server stopped due to uncaughtException');
            });
        }

        // provide friendly message
        if (err.code === 'EACCES') {
            kernel.error('Please run with sudo');
        } else if (err.code === 'EADDRINUSE') {
            kernel.error('Can not start service. %s is occupied by another application', server.info.uri);
        } else {
            kernel.error('Uncaught Exception');
            throw err;
        }

    });

    // bootstrap the server
    server.start(function () {
        running = true;
        if (process.env.NODE_ENV == 'production') {
            kernel.info('\x1b[44m\x1b[33m%s(%s) %s [%s] started at: %s\x1b[0m\x1b[0m',
                kernel.settings.TITLE,
                kernel.settings.ID,
                kernel.settings.VERSION,
                process.pid,
                server.info.uri);
        } else {
            kernel.info('\x1b[41m\x1b[37m%s(%s) %s [%s] started at: %s with %s mode\x1b[0m\x1b[0m',
                kernel.settings.TITLE,
                kernel.settings.ID,
                kernel.settings.VERSION,
                process.pid,
                server.info.uri,
                process.env.NODE_ENV);
        }

        if (done) {
            done();
        }
    });
};


Server.prototype.stop = function (done) {
    this.server.stop(done);
};

/**
 * Extend logging methods
 */
_.forEach(['log', 'info', 'debug', 'silly', 'error', 'warn'], function (func) {
    Server.prototype[func] = function (message, context) {
        this.kernel[func](message, context);
    };
});
