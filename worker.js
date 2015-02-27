'use strict';

var path = require('path');
var fs = require('fs');
var installPackages = require('./lib/install-packages');
var updateCache = require('./lib/update-cache');

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
        console.log('bower exists ', bowerExists);

        if (!bowerExists) {
          return done(null, false);
        }

        var skipCache = config.caching !== 'strict' && config.caching !== 'loose';
        console.log('skip cache', skipCache);

        installPackages(config, context, projectDir, function (err, exact) {
          if (err || exact || skipCache) {
            return done(err);
          }

          updateCache(context, done);
        });
      }
    };

    cb(null, result);
  }
};
