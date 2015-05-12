'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.
var should = require('should');
var onestack = require('onestack');
var Server = require('../index');


describe('Init with enable tasks settings', function () {
    it('should return 500 error', function (done) {
        (function () {
            var app = new Server(onestack);
            app.init(__dirname + '/enable_tasks_service');
            app.start(function(){
                app.stop(function(){
                    done();
                });
            });
        }).should.not.throw();
    });
});
