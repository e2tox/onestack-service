'use strict';



module.exports =  function (request, err) {
    request.log(['ASG', 'EASG9999'], { error: err, message: err.message, stack: err.stack });
};
