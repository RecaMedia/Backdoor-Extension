#!/usr/bin/env node --harmony
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');

program.arguments('<file>')
  .option('-n, --name <name>', 'Name of extension.')
  .option('-p, --ns <ns>', 'Namespace for extension.')
  .option('-ns, --author <author>', 'Author of extension.')
  .option('-u, --url <url>', 'URL to author\'s website.')
  .option('-l, --license <url>', 'License for extension.')
  .action(function(file) {
  co(function *() {
    var name = yield prompt('name: ');
    var ns = yield prompt('namespace: ');
    var author = yield prompt('author: ');
    var url = yield prompt('website: ');
    var license = yield prompt('license: ');
    console.log('Name: %s Namespace: %s File: %s', name, ns, file);
  });
});