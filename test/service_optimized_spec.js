'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.
var should = require('should');
var onestack = require('onestack');
var Server = require('../index');


describe('Init with optimized full customized settings', function () {
    it('should return 500 error', function () {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/optimized_full_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/throw'
            }, function(res) {
                res.statusCode.should.equal(500);
            });
        }).should.throw();
    });

    it('should get xml error', function () {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/optimized_full_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/throw',
                headers: { 'accept': 'xml' }
            }, function(res) {
                res.statusCode.should.equal(500);
            });
        }).should.throw();
    });

    it('should get html error', function () {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/optimized_full_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/throw',
                headers: { 'accept': 'html' }
            }, function(res) {
                res.statusCode.should.equal(500);
            });
        }).should.throw();
    });

    it('should get logs', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/optimized_full_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/logs'
            }, function(res) {
                res.statusCode.should.equal(200);
                done();
            });
        }).should.not.throw();
    });


    it('should get 401 error', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/optimized_full_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/access_denied'
            }, function(res) {
                res.statusCode.should.equal(401);
                done();
            });
        }).should.not.throw();
    });

    it('should get timeout error', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/optimized_full_service');
            app.server.inject({
                method: 'GET',
                url: '/api/v1/timeout'
            }, function(res) {
                res.statusCode.should.equal(500);
                done();
            });
        }).should.not.throw();
    });
});
