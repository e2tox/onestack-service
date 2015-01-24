'use strict';

/**
 * Module dependencies.
 */

var path    = require('path'),
    Hapi    = require('hapi'),
    Hoek    = require('hoek');


var Server = module.exports = function (kernel) {
    this.kernel = kernel;
};


/**
 * Initialize application with configuration folder
 * @param {string} configPath
 */
Server.prototype.init = function (configPath) {

    this.kernel.init(configPath);

};


Server.prototype.settings = function () {
    return this.kernel.settings;
};


Server.prototype.start = function (done) {

    var running = false;
    var kernel = this.kernel;
    var host = this.kernel.settings.HOST || '0.0.0.0';
    var port = '' + this.kernel.settings.PORT + '';

    // changing HOST or PORT requires restart application
    if (port.indexOf('\\\\.\\pipe\\') === 0) { // IIS_Node
        host = port;
        port = undefined;
    }
    else if (port.indexOf('/') !== -1) {  // UNIX domain socket
        host = port;
        port = undefined;
    }

    // import default hapi configuration
    var config = require('./hapi');
    var server = this.server = new Hapi.Server(config);


    server.connection({
        host: host,
        port: port
    });

    server.app = this;

    // implement status api
    require('./status')(server);

    // load controllers from 'app' folder


    // implement swagger interface
    var  swaggerOptions = {
            pathPrefixSize: 3,
            apiVersion: kernel.settings.VERSION
        };

    server.register({
        register: require('hapi-swagger'),
        options: swaggerOptions
    }, function (err) {
        if (err) {
            server.log(['error'], 'hapi-swagger load error: ' + err);
        }else{
            server.log(['start'], 'hapi-swagger interface loaded');
        }
    });

    // gracefully shutdown server with uncaught exception
    process.on('uncaughtException', function(err) {

        // make sure we close down within 30 seconds
        var poop = setTimeout(function() {
            process.exit(1);
        }, 15000);

        // But don't keep the process open just for that!
        poop.unref();

        // stop the server
        if (running) {
            server.stop();
        }

        // provide friendly message
        if (err.code === 'EACCES') {
            console.log('[error] Please run with sudo');
        }
        else if (err.code === 'EADDRINUSE') {
            console.log('[error] Another instance is already running on %s:%s', host, port);
        }
        else {
            console.log('[error] Uncaught Exception');
            throw err;
        }

    });

    // bootstrap the server
    server.start(function() {
        running = true;
        kernel.log('verbose', '%s %s [%s] started at: %s with %s mode', kernel.settings.NAME, kernel.settings.VERSION, process.pid, server.info.uri, process.env.NODE_ENV);
        if (done) {
            done();
        }
    });
};


Server.prototype.stop = function (done) {
    this.server.stop();
    if(done) {
        done();
    }
};

