var gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  browserSync = require('browser-sync').create();

// User scripts
gulp.task('common-js', function() {
  gulp.src('app/js/common.js')
    .pipe(concat('common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

gulp.task('js', ['common-js'], function() {
  return gulp.src([
      //'app/libs/example/example.min.js', // lib
      'app/js/common.min.js' // always at the end
    ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  gulp.src('app/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer(['last 2 versions']))
    .pipe(cleanCSS())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });

  // reload when changing files
  gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
  gulp.watch('app/sass/*.sass', ['sass']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('build', ['removedist', 'sass', 'js'], function name(params) {
  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

  var buildCss = gulp.src('app/css/main.min.css')
    .pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src('app/js/script.min.js').
  pipe(gulp.dest('dist/js'));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('default', ['server']);