const gulp = require('gulp');
const {src, dest} = require('gulp');
const {series, parallel} = require('gulp');
const clean_css = require('gulp-clean-css');
const auto_prefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const order = require('gulp-order');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const minify = require('gulp-minify');
const sass = require('gulp-sass');



gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('test.min.css'))
        .pipe(gulp.dest('./dist/css'));
})


const files_js_order = [
    'src/js/reversi.js',
    'src/js/**/*.js'
];

const vendor_files_js =  [
    'lib/feedbackwidget/src/js/widget.js',
];

const vendor_files_css = [
    'lib/feedbackwidget/src/css/widget.css'
];


const vendorcss = function () {
     return src(vendor_files_css)
        .pipe(clean_css({compatibility: 'ie9'}))
        .pipe(auto_prefixer('last 2 version', 'safari 5', 'ie 9'))
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('./dist/css'));
};

const vendorjs = function () {
    return gulp.src(vendor_files_js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js'));
}

const html = function () {
    return src('./src/html/**/*.html')
        .pipe(dest('dist'))
}

const css = function () {
    return src('./src/css/**/*.css')
        .pipe(clean_css({compatibility: 'ie9'}))
        .pipe(auto_prefixer('last 2 version', 'safari 5', 'ie 9'))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

const sass_build = function () {
    return gulp.src('./src/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./dist/css'));
}

const js = function () {
    return gulp.src('./src/js/**/*.js')
    .pipe(order(files_js_order, { base: './' }))
    .pipe(concat('app.js'))
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(minify())
    .pipe(gulp.dest('./dist/js'));
}

gulp.task('serve', function () {
    browserSync.init({server: "./"});
    gulp.watch("./src/css/**.css", series(css)).on('change', browserSync.reload);
    gulp.watch("./src/css/**.scss", series(sass_build)).on('change', browserSync.reload);
    gulp.watch("./src/html/**/*.html", series(html))
    gulp.watch("./src/js/**/*.js", series(js)).on('change', browserSync.reload);

    gulp.watch("./dist/**/*.html").on('change', browserSync.reload);

});

exports.build = parallel(html, vendorjs, vendorcss, css, sass_build, js)