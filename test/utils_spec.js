'use strict';

/**
 * Test Module dependencies..
 */


// Init the configuration module.
var utils = require('../lib/utils');
var should = require('should');


describe('Utils', function () {
    it('should return globbed files', function (done) {
        (function () {
            utils.getGlobbedFiles(['*.js'], __dirname);
            done();
        }).should.not.throw();
    });

    it('should return globbed files', function (done) {
        (function () {
            utils.getGlobbedFiles(['*.js']);
            done();
        }).should.not.throw();
    });

    it('should not return url files', function (done) {
        (function () {
            utils.getGlobbedFiles(['http://localhost/lib.js']);
            done();
        }).should.not.throw();
    });

    it('should return 0 globbed files', function (done) {
        (function () {
            var files = utils.getGlobbedFiles('*.js');
            files.length.should.be.equal(2);
            done();
        }).should.not.throw();
    });

    it('should return 1 globbed files', function (done) {
        (function () {
            var files = utils.getGlobbedFiles('http://localhost/lib.js');
            files.length.should.be.equal(1);
            done();
        }).should.not.throw();
    });
});
