// nohup.js - https://gist.github.com/supersha/6913695
const tildify = require('tildify');
const username = require('username');

const exec = require('child_process').exec;
const path = require('path');

const options = {
  option: ['o'],
  source: ['s'],
  target: ['t'],
  host: ['h'],
  user: ['u'],
  command: ['c']
};

var argv = require('yargs')
  .demand(['o', 's', 't'])
  .strict()
  .alias(options)
  .argv

const option = argv.o;
const source = path.join(process.cwd(), argv.s);
const target = tildify(path.join(process.cwd(), argv.t));
const user = argv.u || username.sync();
const hostname = argv.h

// https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps
const command = `'rsync -a --delete ${tildify(source)}/ ${target}'`

if (argv.o === 'start') {
  exec(`nohup ./node_modules/.bin/watch-and-exec -d=${source} -c=${command} > /dev/null 2>&1 &`, function(error, stdout, stderr) {
    console.log('watching ' + source + ' for changes');
  });
}

if (argv.o === 'stop') {
  // http://stackoverflow.com/questions/31570240/nodejs-get-process-id-from-within-shell-script-exec
  // http://stackoverflow.com/questions/12941083/get-the-output-of-a-shell-command-in-node-js
  exec('ps -ef | grep ' + source + ' | grep -v grep | awk \'{print $2}\'', function(error, stdout, stderr) {
    const pid = stdout.split('\n')[0];
    exec('kill -9 ' + pid);
  });
}
