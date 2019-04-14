let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let livereload = require('gulp-livereload');
let plumber = require('gulp-plumber');

gulp.task('develop', () => {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js hbs css',
    stdout: false,
  }).on('readable', function() {
    this.stdout.on('data', chunk => {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('copy', () => {
  return gulp
    .src('./node_modules/handlebars-idom/dist/runtime.js')
    .pipe(plumber())
    .pipe(gulp.dest('./public/js/vendor/'));
});

gulp.task('default', ['develop']);
