'use strict';

var path = require('path');
var async = require('async');
var bowerHash = require('./bower-hash');

function updateCache(context, projectDir, bowerDirectory, done) {
  var cachier = context.cachier('modules');

  bowerHash(projectDir, function (err, hash) {
    if (err) {
      return done(err);
    }

    var dest = path.join(projectDir, bowerDirectory);

    context.comment('saved ' + bowerDirectory + ' to cache');

    async.series([
      cachier.update.bind(null, hash, dest),
      cachier.update.bind(null, context.branch, dest)
    ], done);
  });
}

module.exports = updateCache;
