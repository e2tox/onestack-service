'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.
var onestack = require('../index');
var should = require('should');


describe('Init with full customized settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized_service');
            onestack.settings().should.have.property('PORT', 11020);
            done();
        }).should.not.throw();
    });
    it('should able to start and stop service', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized_service');
            onestack.start(function() {
                onestack.stop(function() {
                    done();
                });
            });
        }).should.not.throw();
    });
    it('should able to check service status', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized_service');
            onestack.server.inject({
                method: 'GET',
                url: '/ping'
            }, function(res) {
                res.statusCode.should.equal(200);
                done();
            });
        }).should.not.throw();
    });
    it('should return 404', function (done) {
        (function () {
            onestack.init(__dirname + '/full_customized_service');
            onestack.server.inject({
                method: 'GET',
                url: '/api/v1/not_exists'
            }, function(res) {
                res.statusCode.should.equal(404);
                done();
            });
        }).should.not.throw();
    });
});
