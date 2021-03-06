var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync');
const babel       = require('gulp-babel');
var sass          = require('gulp-sass');
sass.compiler = require('node-sass');

var path = {
  "htmlSrc" : "./*.html",
  "ejsSrc"  : "./src/ejs/",
  "scssSrc" : "./src/scss/**/*.scss",
  "jsSrc"   : "./src/js/**/*.js",
  "es6Src"  : "./src/es6/**/*.es6",
  "imgSrc"  : "./src/images/**",
  "dest"    : "./dest/"
}


gulp.task('bs', function() {
  return browserSync.init({
    port: 3002,
    server: ["./", "./dest"],
    startPath: './dest/index.html',
    notify: false,
    directory: true
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task("ejs", function() {
    gulp.src([
      path.ejsSrc + "**/*.ejs", "!" + path.ejsSrc + "**/_*.ejs"
    ])
    .pipe($.plumber())
    .pipe($.data(function(file) {
      var path1 = file.path.substr(file.path.indexOf('src'));
      var rootPath = '../'.repeat([path1.split('/').length - 2]);
      return {
        'rootPath': rootPath
      }
    }))
    .pipe($.ejs({},{},{ext: '.html'}))
    .pipe($.rename({extname: '.html'}))
    .pipe(gulp.dest(path.dest))
    .pipe(browserSync.reload({
      stream: true,
      once  : true
    }));
});

gulp.task('scss', function() {
  return gulp.src(path.scssSrc)
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe($.sass()).on('error', $.sass.logError)
  .pipe($.autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(path.dest + 'css'))
  .pipe($.autoprefixer())
  .pipe($.rename({
    suffix: '.min'
  }))
  .pipe($.csso())
  .pipe(gulp.dest(path.dest + 'css'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});


gulp.task('image', function() {
  return gulp.src(path.imgSrc)
  .pipe($.plumber())
  .pipe($.changed(path.dest + 'images'))
  .pipe($.imagemin({
    optimizationLevel: 3
  }))
  .pipe(gulp.dest(path.dest + 'images'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});

gulp.task('js', function() {
  return gulp.src([path.jsSrc])
  .pipe($.plumber())
  .pipe($.uglify({preserveComments: 'license'}))
  .pipe($.concat('mainNormal.min.js', {newLine: '\n'}))
  .pipe(gulp.dest(path.dest + 'js'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});

gulp.task('babel', function() {
  return gulp.src([path.es6Src])
  .pipe($.plumber())
  .pipe(babel({
      presets: ['@babel/env']
  }))
  .pipe($.uglify({preserveComments: 'license'}))
  .pipe($.concat('mainEs6.min.js', {newLine: '\n'}))
  .pipe(gulp.dest(path.dest + 'js'))
  .pipe(browserSync.reload({
    stream: true,
    once  : true
  }));
});

gulp.task('default', ['image', 'ejs', 'js', 'bs', 'scss', 'bs-reload','babel'], function() {
  $.watch([path.htmlSrc],function(e) {
    gulp.start("bs-reload")
  });
  $.watch([path.ejsSrc+"*.ejs", path.ejsSrc+"**/*.ejs"],function(e) {
    gulp.start("ejs")
  });
  $.watch([path.scssSrc],function(e) {
    gulp.start("scss")
  });
  $.watch([path.imgSrc],function(e) {
    gulp.start("image")
  });
  $.watch([path.jsSrc],function(e) {
    gulp.start("js")
  });
  $.watch([path.es6Src],function(e) {
    gulp.start("babel")
  });
});
