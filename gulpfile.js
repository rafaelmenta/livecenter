const distPath = './dist';
const appPath = './app';
const vendors = [
  './node_modules/angular/angular.min.js',
  './node_modules/angular-ui-router/release/angular-ui-router.min.js'
];

var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var stylusTask = require('./gulp/task/stylus')(gulp, reload);
var defaultTask = require('./gulp/task/default')(gulp, browserSync, reload);
var cleanTask = require('./gulp/task/clean')(gulp, distPath);
var buildTask = require('./gulp/task/build')(gulp, {
  appPath : appPath,
  distPath : distPath,
  vendors : vendors
});

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
