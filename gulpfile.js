var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync');

var paths = {
  "htmlSrc" : "./*.html",
  "scssSrc" : "./src/scss/**/*.scss",
  "jsSrc"   : "./src/js/**/*.js",
  "es6Src"  : "./src/es6/**/*.es6",
  "imgSrc"  : "./src/images/**",
  "dest"    : "./dest/",
}


gulp.task('bs', function() {
  browserSync.init({
    server: {
      baseComp: "./"
    },
    notify  : true,
    xip     : false
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('scss', function() {
  return gulp.src(paths.scssSrc)
  .pipe($.sourcemaps.init())
  .pipe($.sass()).on('error', $.sass.logError)
  .pipe($.autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(paths.dest + 'css'))
  .pipe($.autoprefixer())
  .pipe($.rename({
    suffix: '.min'
  }))
  .pipe($.csso())
  .pipe(gulp.dest(paths.dest + 'css'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});


gulp.task('image', function() {
  return gulp.src(paths.imgSrc)
  .pipe($.changed(paths.dest + 'images'))
  .pipe($.imagemin({
    optimizationLevel: 3
  }))
  .pipe(gulp.dest(paths.dest + 'images'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});

gulp.task('js', function() {
  return gulp.src([paths.jsSrc])
  .pipe($.plumber())
  .pipe($.uglify({preserveComments: 'license'}))
  .pipe($.concat('mainNormal.min.js', {newLine: '\n'}))
  .pipe(gulp.dest(paths.dest + 'js'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});


gulp.task('default', ['image', 'js', 'bs', 'scss', 'bs-reload',], function() {
  $.watch([paths.htmlSrc],function(e) {
    gulp.start("bs-reload")
  });
  $.watch([paths.scssSrc],function(e) {
    gulp.start("scss")
  });
  $.watch([paths.imgSrc],function(e) {
    gulp.start("image")
  });
  $.watch([paths.jsSrc],function(e) {
    gulp.start("js")
  });

});
