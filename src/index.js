// nohup.js - https://gist.github.com/supersha/6913695
const exec = require('child_process').exec;
const path = require('path');

const target = path.join(process.cwd(), process.argv[2]);
const option = process.argv[3];

if (option === 'start') {
  exec('nohup node ./src/watcher.js ' + target + '> /dev/null 2>&1 &', function(error, stdout, stderr) {
    console.log('watching ' + target + ' for changes');
  });
}

if (option === 'stop') {
  // http://stackoverflow.com/questions/31570240/nodejs-get-process-id-from-within-shell-script-exec
  // http://stackoverflow.com/questions/12941083/get-the-output-of-a-shell-command-in-node-js
  exec('ps -ef | grep ' + target + ' | grep -v grep | cut -d" " -f2', function(error, stdout, stderr) {
    const pid = stdout.split('\n')[0];
    exec('kill -9 ' + pid);
  });
}
