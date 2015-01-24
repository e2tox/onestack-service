'use strict';

/**
 * Module dependencies.
 */


module.exports = {
    //payload: {
    //    maxBytes: 20971520, //20MB
    //    uploads: require('os').tmpDir()
    //},
    //validation: {
    //    allowUnknown: true
    //},
    // Disable SSL support
    //        tls: {
    //            key: fs.readFileSync(path.normalize(path.join(__dirname, './cert/star-fwcms-key.pem')), 'utf8'),
    //            cert: fs.readFileSync(path.normalize(path.join(__dirname, './cert/star-fwcms-cert.pem')), 'utf8')
    //        },
    //        views: {
    //            engines: { 'html': require('handlebars') },
    //            path: path.normalize(path.join(__dirname, '../public'))
    //        },
    load: {
        sampleInterval: 10000 /* capture server load every 10 secs */
    }
};
