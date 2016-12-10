var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var git = require('git-rev');

module.exports = function(gulp, options) {
  var path = options.distPath;
  var appPath = options.appPath;
  var vendors = options.vendors;

  return function() {

  git.short(function(hash) {

    var scriptsFilename = `scripts-${hash}.min.js`,
        vendorsFilename = `vendors-${hash}.js`,
        cssFilename = `styles-${hash}.css`,
        jsPath = `${path}/js`

    gulp.src(`${appPath}/scripts/**/*.js`)
      .pipe(concat(`scripts-${hash}.js`))
      .pipe(gulp.dest(jsPath))
      .pipe(rename(scriptsFilename))
      .pipe(uglify())
      .pipe(gulp.dest(jsPath));

    gulp.src(vendors)
      .pipe(concat(vendorsFilename))
      .pipe(gulp.dest(jsPath));

    gulp.src(`${appPath}/views/**/*.html`)
      .pipe(gulp.dest(`${path}/views/`));

    gulp.src(`${appPath}/index.html`)
      .pipe(htmlreplace({
        js : `js/${scriptsFilename}`,
        css : `css/${cssFilename}`,
        vendor : {
          src: null,
          tpl: `<script src="js/${vendorsFilename}"></script>`
        }
      }))
      .pipe(gulp.dest(`${path}/`));

    gulp.src(`${appPath}/css/**/main.css`)
      .pipe(cleanCSS())
      .pipe(rename(cssFilename))
      .pipe(gulp.dest(`${path}/css/`));
  });
  }
};
