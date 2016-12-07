var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');

module.exports = function(gulp, options) {
  var path = options.distPath;
  var appPath = options.appPath;
  var vendors = options.vendors;

  return function() {

    gulp.src(`${appPath}/scripts/**/*.js`)
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(`${path}/js`))
      .pipe(rename('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(`${path}/js`));

    gulp.src(vendors)
      .pipe(concat('vendors.js'))
      .pipe(gulp.dest(`${path}/js`));

    gulp.src(`${appPath}/views/**/*.html`)
      .pipe(gulp.dest(`${path}/views/`));

    gulp.src(`${appPath}/index.html`)
      .pipe(htmlreplace({
        js : `js/scripts.min.js`,
        vendor : {
          src: null,
          tpl: '<script src="js/vendors.js"></script>'
        }
      }))
      .pipe(gulp.dest(`${path}/`));

    gulp.src(`${appPath}/css/**/*.css`)
      .pipe(cleanCSS())
      .pipe(gulp.dest(`${path}/css/`));
  }
};
