/**
 * OneStack Enterprise Service Platform
 *
 * Created by ling on 1/23/15.
 */

'use strict';

var Server = require('./lib');
var kernel = require('onestack');

// return a new instance of onestack service
module.exports = new Server(kernel);
