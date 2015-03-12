
'use strict';


var swig = require('swig'),
    en = {},
    compiled_en = {};

module.exports = {

    init: function() {
        // TODO: load error messages
    },

    query: function(request, errorCode, data) {

        var error = en[errorCode];
        if (!error) {
            return { statusCode: 500, error: 'EASG9000', message: 'Undocumented Error `' + errorCode + '`' };
        }

        // the general error
        if (errorCode === 'EASG9202') {
            return {
                statusCode: data.statusCode,
                error: errorCode,
                message: data.message || data.error
            };
        }
        else if (data !== null) {

            var compiled = compiled_en[errorCode];
            if (!compiled_en[errorCode]) {

                // compile the error message
                if (typeof error.message === 'string') {
                    compiled = swig.compile(error.message);
                }
                else {
                    compiled = function (data) {
                        return data.message || 'Internal Server Exception';
                    };
                }

                compiled_en[errorCode] = compiled;
            }

            return {
                statusCode: error.statusCode,
                error: error.error,
                message: compiled(data)
            };

        }
        else {
            return error;
        }



    }
};
