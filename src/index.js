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
  config: ['c']
};

const argv = require('yargs')
  .demand(['o'])
  .strict()
  .alias(options)
  .argv;

const option = argv.option;

if (option === 'start' || option === 'stop') {
  let configFile = argv.c;
  if (configFile) {
    configFile = untildify(configFile);
  }
  if (!path.isAbsolute(configFile)) {
    configFile = path.join(process.cwd(), configFile);
  }

  try {
    fs.accessSync(configFile, fs.F_OK);
  } catch (error) {
    console.log('config file does not exist');
    process.exit(1);
  }
  let config;
  try {
    config = require(configFile);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  let source = config.source;
  let target = config.target;

  if (!source) {
    console.log('source directory needs to be specified');
    process.exit(1);
  }

  if (!target) {
    console.log('target directory needs to be specified');
    process.exit(1);
  }

  source = untildify(source);
  target = untildify(target);

  if (!path.isAbsolute(source)) {
    source = path.join(process.cwd(), source);
  }

  if (!path.isAbsolute(target)) {
    target = path.join(process.cwd(), target);
  }

  try {
    fs.accessSync(source, fs.F_OK);
  } catch (error) {
    console.log('source directory does not exist');
    process.exit(1);
  }

  source = tildify(source);
  target = tildify(target);

  let ssh = '';
  const user = config.user || username.sync();
  const host = config.host;

  if (host) {
    target = `${user}@${host}:${target}`;
    ssh = 'ssh';
  }

  let exclude = '';
  if (config.excludes) {
    exclude = config.excludes.map(item => `--exclude ${item}`).join(' ');
  }

  // https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps
  const command = `'rsync -azOte ${ssh} --inplace --delete ${exclude} ${source}/ ${target}'`;
  const watcher = path.join(__dirname, '../node_modules/.bin/watch-and-exec');

  if (option === 'start') {
    exec(`nohup ${watcher} -d=${untildify(source)} -c=${command} > /dev/null 2>&1 &`, () => {
      console.log(`watching ${source} for changes`);
      console.log(`via ${watcher}`);
      console.log(`to excute ${command}`);
    });
  }

  if (option === 'stop') {
    exec(`ps -ef | grep watch-and-rsync/node_modules/.bin/watch-and-exec | grep ${source} | grep -v grep | awk '{print $2}' | xargs kill -9`, error => {
      if (!error) {
        console.log(`not watching ${source} for changes`);
      }
    });
  }
}

if (argv.o === 'list') {
  // http://stackoverflow.com/questions/31570240/nodejs-get-process-id-from-within-shell-script-exec
  // http://stackoverflow.com/questions/12941083/get-the-output-of-a-shell-command-in-node-js
  exec(`ps -ef | grep watch-and-rsync/node_modules/.bin/watch-and-exec | grep -v grep | awk '{print $2"\t"substr($10,4)}'`, (error, stdout) => {
    if (!error && stdout) {
      console.log('PID\tDIR');
      console.log(stdout);
    }
  });
}
