'use strict';

var fs = require('fs');
var path = require('path');
var defaultDirectory = 'bower_components';

module.exports = function (projectDir, cb) {
  var rcPath = path.join(projectDir, '.bowerrc');

  fs.readFile(rcPath, function (err, data) {
    if (err) {
      console.error('Bower: find-directory - ', err);
      return cb(undefined, defaultDirectory);
    }

    var config = JSON.parse(data.toString());

    cb(undefined, config.directory || defaultDirectory);
  });
};
