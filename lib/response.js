/**
 * Copyright 2014 Bestinet Sdn.Bhd.
 *
 * Created by ling on 6/2/14.
 */

'use strict';


var when = require('when'),
    ResponseFormatter = require('./responseFormatter');


module.exports = {


    end: function(request, reply, errorCode, data) {
        request.log(['ASG', errorCode, data]);
        var response = ResponseFormatter.format(request, errorCode, data);
        reply(response);
    },


    fail: function(errorCode, data) {

        var err = new Error(errorCode);
        err.isASG = true;

        if (data instanceof Error) {
            err.origin = data;
        }
        else if (data !== null) {
            err.data = data;
        }

        return when.reject(err);

    },


    complete: function(request, reply, errorCode) {
        return function (err) {
            request.log(['ASG', errorCode], err);

            var response;

            if (err instanceof Error) {
                if (err.isASG) {
                    request.log(['ASG', 'SASG9021']);
                    request.log(['ASG', err.message, err.data]);
                    response = ResponseFormatter.format(request, err.message, err.data);
                }
                else {
                    request.log(['ASG', 'SASG9022']);
                    response = ResponseFormatter.format(request, 'EASG9023', err);
                }
            }
            else if (typeof err === 'string') {
                request.log(['ASG', 'SASG9023']);
                response = ResponseFormatter.format(request, 'EASG9025', err);
            }
            else {
                request.log(['ASG', 'SASG9027'], err);
                response = err;
            }

            reply(response);
        };
    }


};
