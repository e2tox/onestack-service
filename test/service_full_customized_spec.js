'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var service = require('../index');
var should = require('should');


describe('Init with full customized settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            service.init(__dirname + '/full_customized');
            service.settings().should.have.property('PORT', 11020);
            done();
        }).should.not.throw();
    });
    it('should able to start and stop service', function (done) {
        (function () {
            service.init(__dirname + '/full_customized');
            service.start(function() {
                service.stop(function(){
                    done();
                });
            });
        }).should.not.throw();
    });
});
