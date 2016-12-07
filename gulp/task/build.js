var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');

var vendors = [
  './node_modules/angular/angular.min.js',
  './node_modules/angular-ui-router/release/angular-ui-router.min.js'
];

module.exports = function(gulp, path) {
  return function() {

    gulp.src('./app/scripts/**/*.js')
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(`${path}/js`))
      .pipe(rename('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(`${path}/js`));

    gulp.src(vendors)
      .pipe(concat('vendors.js'))
      .pipe(gulp.dest(`${path}/js`));

    gulp.src('./app/views/**/*.html')
      .pipe(gulp.dest(`${path}/views/`));

    gulp.src('./app/index.html')
      .pipe(htmlreplace({
        js : `js/scripts.min.js`,
        vendor : {
          src: null,
          tpl: '<script src="js/vendors.js"></script>'
        }
      }))
      .pipe(gulp.dest(`${path}/`));

    gulp.src('./app/css/**/*.css')
      .pipe(cleanCSS())
      .pipe(gulp.dest(`${path}/css/`));
  }
};
