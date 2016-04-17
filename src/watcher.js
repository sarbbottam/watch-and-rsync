const fs = require('fs');
const exec = require('child_process').exec;

function watch(dir, command) {
  fs.watch(dir, {
    persistent: true,
    recursive: true
  },
  (event, filename) => {
    if (filename) {
      exec(command);
    }
  });
}

watch(process.argv[2]);
