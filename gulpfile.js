var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var reload = browserSync.reload;
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var autoprefixer = require('gulp-autoprefixer');

var minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    inject = require('gulp-inject');
notify = require('gulp-notify');

var src = {
    less: 'src/less/*.less',
    js: 'src/js/*.js',
    html: 'src/*.html'
};
var processors = [px2rem({
    remUnit: 75
})];

// clean project build files
gulp.task('clean', function() {
    return gulp.src(['dist'], {
            read: false
        })
        .pipe(clean())
        .pipe(notify({
            message: 'dist files clean task success !'
        }));
});

// Compile less into CSS and move to dist/css file
gulp.task('less', function() {
    return gulp
        .src(src.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1%']
        }))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({
            message: 'less building css to dist/css files task success !'
        }));
})

// move common css into dist/css
gulp.task('css', function() {
    return gulp
        .src('src/css/common.css')
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({
            message: 'common style copy to dist/css task success !'
        }));
})

// Compile scripts into dist/js files
gulp.task('scripts', function() {
    return gulp.src('./src/js/*.js')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// copy images into dist/img files
gulp.task('images', function() {
    return gulp.src('./src/images/*.{jpg,png,svg}')
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(inject(gulp.src(['./dist/js/common.min.js', './dist/css/common.min.css'], { read: false }), {
            relative: true
        }))
        .pipe(inject(gulp.src(['./dist/js/index.min.js', './dist/css/index.min.css'], { read: false }), {
            name: 'index',
            relative: true
        }))
        .pipe(inject(gulp.src(['./dist/js/register.min.js', './dist/css/register.min.css'], { read: false }), {
            name: 'register',
            relative: true
        }))
        .pipe(inject(gulp.src(['./dist/css/buy.min.css'], { read: false }), {
            name: 'buy',
            relative: true
        }))
        .pipe(inject(gulp.src(['./dist/js/login.min.js', './dist/css/login.min.css'], { read: false}), {
            name: 'login',
            relative: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(notify({
            message: 'inject task complete'
        }));
});

// copy favicon file to dist
gulp.task('favicon', function() {
    return gulp.src('./src/*.ico')
        .pipe(gulp.dest('dist'))
        .pipe(notify({
            message: 'favicon copy success!'
        }));
})

// Static Server + watching scss/html files
gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: './dist'
    });
    gulp.watch(src.less, ['less']).on('change', reload);
    gulp.watch(src.js, ['scripts']).on('change', reload);
    gulp.watch(src.html, ['html']).on('change', reload);
    gulp.watch(['src/images/*.jpg', 'src/images/*.png'], ['images']).on('change', reload);
});

gulp.task('build', ['less', 'css', 'images', 'scripts', 'favicon'], function() {
    gulp.start('html')
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
})