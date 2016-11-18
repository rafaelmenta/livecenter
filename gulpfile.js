var gulp = require('gulp');

var data = require('gulp-data');
var stylus = require('gulp-stylus');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var stylusTask = require('./gulp/task/stylus')(gulp, stylus, data, reload);
var defaultTask = require('./gulp/task/default')(gulp, browserSync, reload);

gulp.task('stylus', stylusTask)
gulp.task('default', ['stylus'], defaultTask);
