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
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');


const files_js_order = [
    'src/js/spa.js',
    'src/js/data.js',
    'src/js/model.js',
    'src/js/reversi.js',
    'src/js/**/*.js'
];

const vendor_files_js =  [
    'lib/feedbackwidget/src/js/widget.js',
    'lib/handlebars-runtime-3/handlebars-v4.1.1.js'
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
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(gulp.dest('./dist/js'));
}

const html = function () {
    return src('./src/html/**/*.html')
     //   .pipe(dest('dist'))
     .pipe(gulp.dest("C:/Users/pascal/source/repos/windesheim/server technology/reversi/ReversiApi/ReversiApi/wwwroot"))
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
    //.pipe(gulp.dest('./dist/css'));
  .pipe(gulp.dest("C:/Users/pascal/source/repos/windesheim/server technology/reversi/ReversiApi/ReversiApi/wwwroot/css"))

}

const js = function () {
    return gulp.src('./src/js/**/*.js')
    .pipe(order(files_js_order, { base: './' }))
    .pipe(concat('app.js'))
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    // .pipe(uglify())
    // .pipe(minify())
  //  .pipe(gulp.dest('./dist/js'));
  .pipe(gulp.dest("C:/Users/pascal/source/repos/windesheim/server technology/reversi/ReversiApi/ReversiApi/wwwroot/js"))

}

gulp.task('templates', function(){
    return gulp.src(['./src/templates/**/*.hbs'])
    // Compile each Handlebars template source file to a template function
        .pipe(handlebars())
        // Wrap each template function in a call to Handlebars.template
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        // Declare template functions as properties and sub-properties of MyApp.templates
        .pipe(declare({
            namespace: 'reversi_templates',
            noRedeclare: true, // Avoid duplicate declarations
            processName: function(filePath) {
                // Allow nesting based on path using gulp-declare's processNameByPath()
                // You can remove this option completely if you aren't using nested folders
                // Drop the client/templates/ folder from the namespace path by removing it from the filePath
                return declare.processNameByPath(filePath.replace('client/templates/', ''));
            }
        }))
        .pipe(concat('templates.js'))
       // .pipe(gulp.dest('dist/js/'))
       .pipe(gulp.dest("C:/Users/pascalsourcereposwindesheimserver technologyreversiReversiApiReversiApiwwwroot"))
});


gulp.task('serve', function () {
    browserSync.init({server: "./"});
    gulp.watch("./src/css/**.css", series(css)).on('change', browserSync.reload);
    gulp.watch("./src/css/**.scss", series(sass_build)).on('change', browserSync.reload);
    gulp.watch("./src/html/**/*.html", series(html))
    gulp.watch("./src/js/**/*.js", series(js)).on('change', browserSync.reload);

    gulp.watch("./dist/**/*.html").on('change', browserSync.reload);

});

exports.build = parallel(html, vendorjs, vendorcss, css, sass_build, js)