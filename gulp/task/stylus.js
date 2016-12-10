var data = require('gulp-data');
var stylus = require('gulp-stylus');

module.exports = function(gulp, reload) {
  return function() {
    gulp.src('./app/styles/**/*.styl')
      .pipe(data(function(file) {
        return {
          componentPath: '/' + (file.path.replace(file.base, '').replace(/\/[^\/]*$/, ''))
        };
      }))
      .pipe(stylus())
      .pipe(gulp.dest('./app/css'))
      .pipe(reload({stream : true}));
  };

};
