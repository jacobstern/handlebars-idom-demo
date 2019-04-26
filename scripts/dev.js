const path = require('path');
const livereload = require('livereload');
const nodemon = require('nodemon');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const livereloadServer = livereload.createServer({
    exts: ['hbs', 'css'],
  });
  livereloadServer.watch(rootDir);
  nodemon({
    script: 'bin/www',
    ext: 'js',
    stdout: false,
    ignore: ['public/*', 'scripts/*'],
  }).on('readable', function() {
    this.stdout.on('data', chunk => {
      if (/^Express server listening on port/.test(chunk)) {
        livereloadServer.refresh(rootDir);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
}

main();
