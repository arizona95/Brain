var program = require('commander');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var config = require('./../config');

function dirParamToPath(dirParam) {
  switch (dirParam) {
    case 'dist':
      return config.distDir;
    case 'serve':
      return config.serveDir;
  }
  return null;
}

var commands = {
  clear: function (value) {
    var targetPath = dirParamToPath(value);

    if (targetPath) {
      rimraf.sync(targetPath);
    }
  },

  create: function (value) {
    var targetPath = dirParamToPath(value);

    if (targetPath) {
      mkdirp.sync(targetPath);
    }
  },
};

program
  .option('-c, --clear [serve/dist]')
  .option('-cr, --create [serve/dist]')
  .parse(process.argv);

for (var commandName in commands) {
  if (commands.hasOwnProperty(commandName) && program[commandName]) {
    commands[commandName](program[commandName]);
  }
}

