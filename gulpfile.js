const distPath = './dist';

var gulp = require('gulp');

var data = require('gulp-data');
var stylus = require('gulp-stylus');

var browserSync = require('browser-sync');
var reload = browserSync.reload;


var stylusTask = require('./gulp/task/stylus')(gulp, stylus, data, reload);
var defaultTask = require('./gulp/task/default')(gulp, browserSync, reload);
var buildTask = require('./gulp/task/build')(gulp, distPath );
var cleanTask = require('./gulp/task/clean')(gulp, distPath);

gulp.task('stylus', stylusTask);
gulp.task('clean', cleanTask);
gulp.task('default', ['stylus'], defaultTask);
gulp.task('build', ['clean'], buildTask);
gulp.task('build-server', function() {
  browserSync({
    server : {
      baseDir : 'dist'
    }
  })
});
