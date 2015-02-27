'use strict';

var bower = process.platform === 'win32' ? 'bower.cmd' : 'bower';

module.exports = function (command) {
  var args = [command, '--config.interactive=false'];

  return {
    command: bower,
    args: args,
    screen: 'bower ' + command
  };
};
