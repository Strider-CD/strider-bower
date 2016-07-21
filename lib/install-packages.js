'use strict';

var path = require('path');
var bowerHash = require('./bower-hash');
var bowerCommand = require('./bower-command');

function installPackages(config, context, projectDir, bowerDirectory, done) {
  var update = config.update_cache;
  var cachier = context.cachier('modules');
  var policy = config.caching;

  if (policy !== 'strict' && policy !== 'loose') {
    return runBower('install', context, projectDir, done);
  }

  // hash the bower.json
  bowerHash(projectDir, function (err, hash) {
    if (err) {
      return done(err);
    }

    var dest = path.join(projectDir, bowerDirectory);

    // try for an exact match
    cachier.get(hash, dest, function (err) {
      if (!err) {
        context.comment('restored ' + bowerDirectory + ' from cache');

        if (!update) {
          return done(null, true);
        }

        return runBower('update', context, projectDir, done);
      }

      if (policy === 'strict') {
        return runBower('install', context, projectDir, done);
      }

      // otherwise restore from the latest branch, prune and update
      cachier.get(context.branch, dest, function (err) {
        if (err) {
          return runBower('install', context, projectDir, done);
        }

        context.comment('restored ' + bowerDirectory + ' from cache');

        runBower('prune', context, projectDir, function (err) {
          if (err) {
            return done(err);
          }

          runBower('update', context, projectDir, done);
        });
      });
    });
  });
}

module.exports = installPackages;

function runBower(command, context, subdir, cb) {
  context.cmd({
    cmd: bowerCommand(command),
    cwd: subdir
  }, cb);
}
