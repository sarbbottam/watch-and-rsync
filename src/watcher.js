const fs = require('fs');

function watch(dir) {
  fs.watch(dir, {
    persistent: true,
    recursive: true
  },
  (event, filename) => {
    if (filename) {
      console.log(`filename provided: ${filename}`);
    }
  });
}

watch(process.argv[2]);
