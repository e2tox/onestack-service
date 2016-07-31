'use strict';

/**
 * Module dependencies.
 */


var http = require('http'),
    Response = require('hapi/lib/response'),
    errors = require('./errors');


function html(request, error, data) {
    var text = error.statusCode + ' ' + error.message,
        res = '<html><head><title>' +
        text + '</title></head><body bgcolor="white"><center><h1>' +
        text + '</h1></center><hr><center>' + request.id + '</center>';

    if (typeof data !== 'undefined') {
        res += '<center><p>' + JSON.stringify(data) + '</p></center>';
    }
    res += '</body></html>';
    return res;
}

function xml(request, error, data) {
    var res = '<Response><StatusCode>' +
        error.statusCode + '</StatusCode><Error>' +
        error.error + '</Error><Message>' +
        error.message + '</Message>';

    if (typeof data !== 'undefined') {
        res += '<Data>' + JSON.stringify(data) + '</Data>';
    }
    res += '<Ticket>' + request.id + '</Ticket></Response>';
    return res;
}

function json(request, error, data) {
    var res = {
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
        ticket: request.id
    };
    if (typeof data !== 'undefined') {
        res.data = data;
    }
    return JSON.stringify(res);
}


module.exports = {

    format: function (request, errorCode, data) {

        var payload, type,
            accept = request.headers.accept || '*/*';

        var error = errors.query(request, errorCode, data);

        request.log(['GEN', errorCode], data);

        if (accept.indexOf('text') >= 0) {
            request.log(['GEN', 'SGEN9102']);
            type = 'text/html';
            payload = html(request, error);
        } else if (accept.indexOf('xml') >= 0) {
            request.log(['GEN', 'SGEN9101']);
            type = 'application/xml';
            payload = xml(request, error);
        } else {
            request.log(['GEN', 'SGEN9103']);
            type = 'application/json';
            payload = json(request, error);
        }

        var response = Response.wrap(payload, request);
        response = response.type(type).bytes(payload.length);

        if (error.statusCode === 401) {
            request.log(['GEN', 'SGEN9104']);
            response = response.header('WWW-Authenticate', 'Basic realm="Genesis"');
        }

        response = response.code(error.statusCode);
        return response;
    }

};
