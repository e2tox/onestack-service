/**
 * Created by ling on 5/12/15.
 */

'use strict';


/**
 * Module dependencies.
 */

var _               = require('lodash'),
    path            = require('path'),
    parser          = require('cron-parser'),

    internals       = {};


internals.jobs = {};


/**
 * Trigger a job
 * @param job
 */
internals.trigger = function(job) {
    job.callback(function(result) {
        job.success++;
        job.last_result = result;

        job.next = job.interval.next();
        var timeout = job.next.getTime() - new Date().getTime();
        job.timer = setTimeout(internals.trigger, timeout, job);
    }, function(err) {
        job.failure++;
        job.last_error = err;

        job.next = job.interval.next();
        var timeout = job.next.getTime() - new Date().getTime();
        job.timer = setTimeout(internals.trigger, timeout, job);
    })
};


/**
 * Run `jobCallback` on scheduled time
 * @param name
 * @param cronExpression
 * @param jobCallback
 */
internals.registerTask = function(name, cronExpression, jobCallback) {

    var job = {
        name: name,
        interval: parser.parseExpression(cronExpression),
        callback: jobCallback,
        done: false,
        success: 0,
        failure: 0
    };

    if (!internals.jobs[name]) {
        internals.jobs[name] = job;
    }

    job.next = job.interval.next();
    var timeout = job.next.getTime() - new Date().getTime();

    job.timer = setTimeout(internals.trigger, timeout, job);

};


exports.LoadServerTasks = function(server, kernel) {

    var settings = kernel.settings;

    // scan all tasks and register with scheduler
    // load tasks from server/tasks
    var tasks = require('./utils').getGlobbedFiles([
            path.join(settings.HOME_DIR, 'server/tasks/*.server.task.js'),
            path.join(settings.HOME_DIR, 'server/tasks/**/*.server.task.js')]
    );

    kernel.debug('Detected ' + tasks.length + ' task(s)', tasks);

    var success = 0;
    _.forEach(tasks, function (taskFile) {
        try {
            var basename = path.basename(taskFile);
            var task = require(taskFile);
            internals.registerTask(basename, task.trigger, task.main);
            success++;
        }
        catch (err) {
            kernel.error('Error loading task: ' + taskFile, { message: err.message });
            throw err;
        }
    });

    kernel.info('Successful load %s task(s)', success);
};
