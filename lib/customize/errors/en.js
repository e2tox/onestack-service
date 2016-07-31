'use strict';


module.exports = {


    /* general errors */
    'EGEN9023': {
        error: 'EGEN9023',
        statusCode: 500,
        message: 'Uncaught Application Exception - {{message}}'
    },
    'EGEN9025': {
        error: 'EGEN9025',
        statusCode: 500,
        message: 'Application Error'
    },
    'EGEN9202': {
        error: 'EGEN9202',
        statusCode: '{{statusCode}}',
        message: '{{message||error}}'
    },
    'EGEN9302': {
        error: 'EGEN9302',
        statusCode: '{{statusCode}}',
        message: '{{message||error}}'
    },

    /* Load Balancer */
    'EGEN3001': {
        error: 'EGEN3001',
        statusCode: 404,
        message: 'Host not found'
    },
    'EGEN3002': {
        error: 'EGEN3002',
        statusCode: 522,
        message: 'Connection timed out'
    },
    'EGEN3003': {
        error: 'EGEN3003',
        statusCode: 503,
        message: 'Service Unavailable'
    },
    'EGEN3004': {
        error: 'EGEN3004',
        statusCode: 521,
        message: 'Origin is down'
    },
    'EGEN3005': {
        error: 'EGEN3005',
        statusCode: 500,
        message: 'Backend Service Error'
    },

    /* Form authenticate */
    'FGEN1009': {
        error: 'FGEN1009',
        statusCode: 403,
        message: 'Access Denied'
    },

    /* Welcom */
    'SGEN2000': {
        error: 'SGEN2000',
        statusCode: 200,
        message: 'Success'
    }

};
