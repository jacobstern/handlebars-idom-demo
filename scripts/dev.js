const path = require('path');
const Bundler = require('parcel-bundler');
const livereload = require('livereload');
const nodemon = require('nodemon');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const livereloadServer = livereload.createServer({
    exts: ['hbs', 'css'],
  });
  livereloadServer.watch(rootDir);

  const bundler = new Bundler(
    path.resolve(rootDir, 'assets/js/search-page.js'),
    {
      outDir: path.resolve(rootDir, 'public/build/'),
      publicUrl: './',
    }
  );
  bundler.on('buildEnd', () => {
    livereloadServer.refresh(rootDir);
  });
  await bundler.bundle();

  nodemon({
    script: 'bin/www',
    ext: 'js',
    stdout: false,
    ignore: ['public/*', 'scripts/*', 'assets/*'],
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
