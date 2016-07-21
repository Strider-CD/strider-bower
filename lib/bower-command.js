'use strict';

module.exports = function (command) {
  var args = [command, '--config.interactive=false', '--allow-root'];

  return {
    command: 'bower',
    args: args,
    screen: 'bower ' + command
  };
};
