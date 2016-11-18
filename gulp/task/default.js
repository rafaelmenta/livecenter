module.exports = function(gulp, browserSync, reload) {
  return function() {
    browserSync({
      server : {
        baseDir : 'app'
      }
    });
    gulp.watch(['*.html', 'scripts/**/*.js'], { cwd : 'app'}, reload);
    gulp.watch(['app/styles/**/*.styl'], ['stylus']);
  }
}
