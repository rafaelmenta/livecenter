var path = require('path'),
    fs = require('fs'),
    url = require('url');

var folder = path.resolve(__dirname, '../../app/');
var defaultFile = 'index.html';

module.exports = function(gulp, browserSync, reload) {
  return function() {
    browserSync({
      server : {
        baseDir : 'app',
        routes : {
          '/vendor/' : './node_modules'
        },
        middleware : function(req, res, next) {
          var fileName = url.parse(req.url);
          fileName = fileName.href.split(fileName.search).join('');
          var fileExists = fs.existsSync(folder + fileName);
          if (!fileExists && fileName.indexOf('browser-sync-client') < 0 && fileName.indexOf('/vendor/') < 0) {
              req.url = '/' + defaultFile;
          }
          return next();
        }
      }
    });
    gulp.watch(['*.html', 'scripts/**/*.js', 'views/**/*.html'], { cwd : 'app'}, reload);
    gulp.watch(['app/styles/**/*.styl'], ['stylus']);
  }
}
