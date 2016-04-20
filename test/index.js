const assert = require('assert');

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

exec(`mkdir -p ./test/fixtures/source`);
exec(`mkdir -p ./test/fixtures/target`);

exec(`./src/index.js -o=start -s=./test/fixtures/source -t=./test/fixtures/target`, error => {
  assert.equal(error, null);

  setTimeout(() => {
    exec(`touch ./test/fixtures/source/foo`);
    setTimeout(() => {
      exec(`ps -ef | grep watch-and-exec | grep -v grep | awk '{print $2}' | xargs kill -9`, () => {
        const error = fs.accessSync(path.join(process.cwd(), './test/fixtures/target/foo'), fs.F_OK);
        assert.equal(error, null);
        console.log('All the test have passed successfully');
        exec(`rm -rf ./test/fixtures`);
      });
    }, 100);
  }, 1000);
});
