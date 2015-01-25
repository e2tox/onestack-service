'use strict';

/**
 * Test Module dependencies.
 */


// Init the configuration module
var onestack = require('../index');
var should = require('should');


describe('Init with full customized settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized');
            onestack.settings().should.have.property('PORT', 11020);
            done();
        }).should.not.throw();
    });
    it('should able to start and stop service', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized');
            onestack.start(function() {
                onestack.stop(function(){
                    done();
                });
            });
        }).should.not.throw();
    });
    it('should able to check service status', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized');
            onestack.server.inject({
                method: 'GET',
                url: '/api/v1/status'
            }, function(res) {
                res.statusCode.should.equal(200);
                done();
            });
        }).should.not.throw();
    });
});
