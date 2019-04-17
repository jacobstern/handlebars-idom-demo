const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');

gulp.task('livereload', () => {
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

gulp.task('vendor', () => {
  return gulp
    .src('./node_modules/handlebars-inc/dist/handlebars-inc-runtime.min.js')
    .pipe(plumber())
    .pipe(gulp.dest('./public/js/vendor/'));
});

gulp.task('develop', ['vendor', 'livereload']);
gulp.task('default', ['develop']);
