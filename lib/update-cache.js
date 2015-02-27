'use strict';

var path = require('path');
var async = require('async');
var bowerHash = require('./bower-hash');

function updateCache(context, done) {
  var cachier = context.cachier('modules');
  var dataDir = context.dataDir;

  bowerHash(dataDir, function (err, hash) {
    if (err) {
      return done();
    }

    var dest = path.join(dataDir, 'bower_components');

    context.comment('saved bower_components to cache');

    async.series([
      cachier.update.bind(null, hash, dest),
      cachier.update.bind(null, context.branch, dest),
    ], done);
  });
}

module.exports = updateCache;
