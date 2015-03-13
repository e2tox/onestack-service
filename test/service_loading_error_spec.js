'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.
var onestack = require('../index');
var should = require('should');


describe('Init with error customized settings', function () {
    it('should not able to start server', function () {
        (function () {
            onestack.init(__dirname + '/error_loading_controller_service');
            onestack.start();
            onestack.stop();
        }).should.throw();
    });
});
