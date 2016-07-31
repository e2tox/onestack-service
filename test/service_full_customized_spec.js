'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.

var should = require('should');
var onestack = require('onestack');
var Server = require('../index');


describe('Init with full customized settings', function () {
    it('should contains PORT number', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/full_customized_service');
            app.settings().should.have.property('PORT', 11020);
            done();
        }).should.not.throw();
    });
    it('should able to start and stop service', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/full_customized_service');
            app.start(function () {
                app.stop(function () {
                    done();
                });
            });
        }).should.not.throw();
    });
    it('should able to check service status', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/full_customized_service');
            app.server.inject({
                method: 'GET',
                url: '/ping'
            }, function (res) {
                res.statusCode.should.equal(200);
                done();
            });
        }).should.not.throw();
    });
    it('should able to access api spec', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/full_customized_service');
            app.server.inject({
                method: 'GET',
                url: '/spec'
            }, function (res) {
                res.statusCode.should.equal(200);
                done();
            });
        }).should.not.throw();
    });
    it('should return 404', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/full_customized_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/not_exists'
            }, function (res) {
                res.statusCode.should.equal(404);
                done();
            });
        }).should.not.throw();
    });
});
