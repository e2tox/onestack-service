/**
 * Module dependencies.
 */

exports.trigger = '*/1 * * * * *';


exports.main = function(resolve, reject) {

    console.log('Run every 1 second');

    resolve();

};
