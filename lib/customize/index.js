'use strict';

/**
 * Module dependencies.
 */


module.exports = function (server, kernel) {

    var settings = server.app.settings();

    if (settings.DISABLE_PER_REQUEST_LOG) {
        // simple logging
        server.ext('onRequest', require('./logging/simple/onRequestBegin'));
        server.ext('onPreResponse', require('./logging/simple/onRequestComplete'));
        server.on('request', require('./logging/simple/onLogging'));
        server.on('request-error', require('./logging/simple/onRequestError'));
    } else {
        // detailed logging
        server.on('request-internal', require('./logging/detailed/onRequest'));
        server.ext('onRequest', require('./logging/detailed/onRequestBegin'));
        server.ext('onPreResponse', require('./logging/detailed/onRequestComplete'));
        server.on('request', require('./logging/detailed/onLogging'));
        server.on('request-error', require('./logging/detailed/onRequestError'));
    }


    // implement status api
    require('./routes/status.server.route')(server);

    var tags;
    if (settings.EXPLORE_SERVICE_TAGS) {
        tags = (settings.EXPLORE_SERVICE_TAGS + '').split(',');
    }

    // implement swagger api schema
    var swaggerOptions = {
        endpoint: '/spec',
        requiredTags: tags,
        info: {
            title: settings.NAME || settings.TITLE,
            description: settings.DESCRIPTION,
            version: settings.VERSION,
            termsOfService: settings.URL || 'http://onestack.io/terms/',
            contact: {
                email: settings.EMAIL || 'support@onestack.io'
            },
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
            }
        }
    };

    if (settings.EXPLORE_SERVICE_BASE) {
        swaggerOptions.stripPrefix = settings.EXPLORE_SERVICE_BASE;
    }

    //if (tags) {
    //    swaggerOptions.requiredTags = tags;
    //}

    // generate api schema from routes
    server.register({
            register: require('../../modules/spec'),
            options: swaggerOptions
        },
        function (err) {
            if (err) {
                kernel.error('Failed to load service spec: ' + err.message);
                throw err;
            }
        });

    var swaggerUiOptions = {
        title: 'OneStack Enterprise Service Platform'
            //swaggerOptions: {
            //version: '2.3.3'
            //validatorUrl: 'http://online.swagger.io/validator/debug'
            //}
            //authorization: { // see above
            //    field: 'apiKey',
            //    scope: 'query' // header works as well
            //    valuePrefix: 'bearer '// prefix incase
            //    defaultValue: undefined,
            //    placeholder: undefined
            //}
    };

    server.register([
        require('inert'),
        require('vision'), {
            register: require('../../modules/ui'),
            options: swaggerUiOptions
        }
    ], {
        routes: {
            prefix: '/explorer'
        }
    }, function (err) {
        if (err) {
            kernel.error('Failed to load service explorer: ' + err.message);
            throw err;
        }
    });


};
