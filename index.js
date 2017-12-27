#!/usr/bin/env node --harmony
const co = require('co');
const fs = require('fs');
const fse = require('fs-extra');
const filepath = require('filepath');
const ncp = require('ncp').ncp;
const path = require('path');
const program = require('commander');
const prompt = require('co-prompt');
const sh = require("shelljs");
const colors = require('colors/safe');

const cwd = sh.pwd().stdout;
const package_dir = filepath.create(__dirname).path;

var new_package = {
  template: "",
  path: "",
  transLen: 0,
  transCnt: 0,
  input: {
    name: "",
    ns: "",
    description: "",
    author: "",
    url: "",
    license: ""
  }
}

const transfer_event = function(count) {
  new_package.transCnt = new_package.transCnt + 1;

  if (new_package.transLen === new_package.transCnt) {
    
    console.info(colors.yellow("File update started..."));

    let index_path = new_package.path + '/index.js';
    let index_content = fs.readFileSync(index_path, "utf8");
    index_content = index_content.replace("[[namespace]]", new_package.input.ns);
    fs.writeFileSync(index_path, index_content, 'utf8');

    let json_path = new_package.path + '/data.json';
    let json_content = fs.readFileSync(json_path, "utf8");
    json_content = json_content.replace("[[name]]", '"'+new_package.input.name+'"');
    json_content = json_content.replace("[[namespace]]", '"'+new_package.input.ns+'"');
    json_content = json_content.replace("[[author]]", '"'+new_package.input.author+'"');
    json_content = json_content.replace("[[url]]", '"'+new_package.input.url+'"');
    json_content = json_content.replace("[[license]]", '"'+new_package.input.license+'"');
    json_content = json_content.replace("[[description]]", '"'+new_package.input.description+'"');
    fs.writeFileSync(json_path, json_content, 'utf8');

    console.log(colors.cyan("Index.js & data.json have been updated."));
    console.log(colors.red("Visit http://bkdr.org for API documentation."));
    process.exit();
  }
}

const copy = function(src, dest) {
  fse.copy(src, dest, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(colors.green('Copied to ' + dest));
    transfer_event();
  })
};

const copyDir = function(src, dest) {
  var files = fs.readdirSync(src);
  new_package.transLen = files.length;
  for(var i = 0; i < files.length; i++) {
    var current = fs.lstatSync(path.join(src, files[i]));
    if(current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if(current.isSymbolicLink()) {
      var symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};

function init() {
  program.arguments('<file>')
    .option('-n, --name <name>', 'Name of extension. (e.g. My Cool Extension)')
    .option('-p, --ns <ns>', 'Namespace for extension. (e.g. MyCoolExtension)')
    .option('-ns, --author <author>', 'Author of extension. (e.g. John Doe)')
    .option('-u, --url <url>', 'URL to author\'s website. (e.g. http://mydomain.com)')
    .option('-l, --license <url>', 'License for extension. (e.g. MIT)')
    .action(function(type) {
    co(function *() {
      var name = yield prompt(colors.white('name: '));
      var ns = yield prompt(colors.white('namespace: '));
      var description = yield prompt(colors.white('description: '));
      var author = yield prompt(colors.white('author: '));
      var url = yield prompt(colors.white('website: '));
      var license = yield prompt(colors.white('license: '));

      new_package.template = package_dir + '/template';
      new_package.path = cwd + '/' + ns;

      new_package.input = Object.assign({}, new_package.input, {
        name,
        ns,
        description,
        author,
        url,
        license
      })

      if (!fs.existsSync(new_package.path)) {
        fs.mkdirSync(new_package.path);
      }

      copyDir(new_package.template, new_package.path);
    });
  }).parse(process.argv);
}

init();