#!/usr/bin/env node --harmony
var co = require('co');
var fs = require('fs');
var filepath = require('filepath');
var path = require('path');
var program = require('commander');
var prompt = require('co-prompt');
var sh = require("shelljs");

var cwd = sh.pwd().stdout;
var package_dir = filepath.create(__dirname);

function copy(from, to) {
  return new Promise(function (resolve, reject) {
    fs.access(from, fs.F_OK, function (error) {
      if (error) {
        reject(error);
        return false;
      } else {
        var inputStream = fs.createReadStream(from);
        var outputStream = fs.createWriteStream(to);

        function rejectCleanup(error) {
            inputStream.destroy();
            outputStream.end();
            reject(error);
            return false;
        }

        inputStream.on('error', rejectCleanup);
        outputStream.on('error', rejectCleanup);

        outputStream.on('finish', resolve);

        inputStream.pipe(outputStream);
        return true;
      }
    });
  });
}

function init() {
  program.arguments('<file>')
    .option('-n, --name <name>', 'Name of extension. (e.g. My Cool Extension)')
    .option('-p, --ns <ns>', 'Namespace for extension. (e.g. MyCoolExtension)')
    .option('-ns, --author <author>', 'Author of extension. (e.g. John Doe)')
    .option('-u, --url <url>', 'URL to author\'s website. (e.g. http://mydomain.com)')
    .option('-l, --license <url>', 'License for extension. (e.g. MIT)')
    .action(function(file) {
    co(function *() {
      // var name = yield prompt('name: ');
      var ns = yield prompt('namespace: ');
      // var author = yield prompt('author: ');
      // var url = yield prompt('website: ');
      // var license = yield prompt('license: ');
      // console.log('Name: %s Namespace: %s File: %s', name, ns, file);
      console.log("Current Dir: ",cwd);
      console.log("Package Dir: ",package_dir);

      if (copy(package_dir+'/template/test.txt', cwd+'/'+ns+'/test.txt')) {
        console.log('Your extension\'s base has been created.');
      }

      // End script.
      process.exit();
    });
  }).parse(process.argv);
}

init();