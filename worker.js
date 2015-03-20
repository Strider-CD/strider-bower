'use strict';

var path = require('path');
var fs = require('fs');
var installPackages = require('./lib/install-packages');
var updateCache = require('./lib/update-cache');
var findDirectory = require('./lib/find-directory');

module.exports = {
  // Initialize the plugin for a job
  //   config:     taken from DB config extended by flat file config
  //   job & repo: see strider-runner-core
  //   cb(err, initialized plugin)
  init: function (config, job, context, cb) {
    config = config || {};

    var subDir = config.subDir || '';
    var projectDir = path.join(context.dataDir, subDir);
    var binBase = config.globalBower ? __dirname : projectDir;
    var paths = [path.join(binBase, 'node_modules', '.bin')];

    var result = {
      path: paths,
      env: {
        MOCHA_COLORS: 1
      },

      prepare: function (context, done) {
        var bowerExists = fs.existsSync(path.join(projectDir, 'bower.json'));

        if (!bowerExists) {
          return done(null, false);
        }

        var skipCache = config.caching !== 'strict' && config.caching !== 'loose';

        findDirectory(projectDir, function (err, bowerDirectory) {
          installPackages(config, context, projectDir, bowerDirectory, function (err, exact) {
            if (err || exact === true || skipCache) {
              if (skipCache) {
                context.comment('skipping cache update');
              }

              return done(err);
            }

            updateCache(context, bowerDirectory, done);
          });
        });
      }
    };

    cb(null, result);
  }
};
