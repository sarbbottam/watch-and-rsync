#!/usr/bin/env node

'use strict';

// nohup.js - https://gist.github.com/supersha/6913695
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const tildify = require('tildify');
const untildify = require('untildify');
const username = require('username');

const options = {
  option: ['o'],
  source: ['s'],
  target: ['t'],
  host: ['h'],
  user: ['u']
};

const argv = require('yargs')
  .demand(['o', 's'])
  .strict()
  .alias(options)
  .argv;

let source;
let target;
argv.s = untildify(argv.s);
argv.t = untildify(argv.t);

if (path.isAbsolute(argv.s)) {
  source = argv.s;
} else {
  source = path.join(process.cwd(), argv.s);
}

if (argv.t) {
  if (path.isAbsolute(argv.t)) {
    target = argv.t;
  } else {
    target = path.join(process.cwd(), argv.t);
  }
} else {
  target = source;
}

target = tildify(target);

try {
  fs.accessSync(source, fs.F_OK);
} catch (error) {
  console.log('source directory does not exist');
  process.exit(1);
}

let ssh = '';
const user = argv.u || username.sync();
const hostname = argv.h;
// should be generated
const exclude = '--exclude node_modules';

if (hostname) {
  target = `${user}@${hostname}:${target}`;
  ssh = 'ssh';
}

// https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps
const command = `'rsync -azOte ${ssh} --delete ${exclude} ${tildify(source)}/ ${target}'`;
const watcher = path.join(__dirname, '../node_modules/.bin/watch-and-exec');

if (argv.o === 'start') {
  exec(`nohup ${watcher} -d=${source} -c=${command} > /dev/null 2>&1 &`, () => {
    console.log(`watching ${source} for changes`);
    console.log(`via ${watcher}`);
    console.log(`to excute ${command}`);
  });
}

if (argv.o === 'stop') {
  // http://stackoverflow.com/questions/31570240/nodejs-get-process-id-from-within-shell-script-exec
  // http://stackoverflow.com/questions/12941083/get-the-output-of-a-shell-command-in-node-js
  exec(`ps -ef | grep ${source} | grep -v grep | awk '{print $2}' | xargs kill -9`, error => {
    if (!error) {
      console.log(`not watching ${source} for changes`);
    }
  });
}
