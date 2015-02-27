'use strict';

var fs = require('fs');
var path = require('path');
var md5 = require('MD5');

function bowerHash(dir, done) {
  fs.readFile(path.join(dir, 'bower.json'), 'utf8', function (err, bowerJson) {
    if (err) {
      return done(err);
    }

    var hash = md5(bowerJson);

    done(null, hash);
  });
}

module.exports = bowerHash;
