var gulp = require('gulp'), cssnano = require('gulp-cssnano'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify'), concat = require('gulp-concat')
    , imagemin = require('gulp-imagemin'), cache = require('gulp-cache'), bs = require('browser-sync').create(),
    sass = require('gulp-sass'),util = require('gulp-util'),sourcemaps = require('gulp-sourcemaps')

var path = {
    'html': './templates/**/',
    'css': './src/css/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};
//处理html任务
gulp.task('html', () => {
    return gulp.src(path.html + '*.html')
        .pipe(bs.stream())
})
//定义一个css任务
gulp.task('css', () => {
    return gulp.src(path.css + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});
//定义处理js文件的任务
gulp.task('js', () => {
    return gulp.src(path.js + '*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify()).on('error',util.log)
        .pipe(rename({'suffix': '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
})
//定义处理图片文件的任务
gulp.task('images', () => {
    return gulp.src(path.images + '*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
})
//定义监听文件修改的任务
gulp.task('watch', () => {
    gulp.watch(path.css + '*.scss', gulp.series('css'))
    gulp.watch(path.html + '*.html', gulp.series('html'))
    gulp.watch(path.js + '*.js', gulp.series('js'))
    gulp.watch(path.images + '*.*', gulp.series('images'))
})
// 初始化browser-sync服务
gulp.task('bs', () => {
    bs.init({
        'server': {
            'baseDir': './'
        }
    })
})
//创建一个默认的任务
gulp.task('default', gulp.parallel('bs', 'watch'))


// var gulp = require('gulp'), connect = require('gulp-connect'), cssnano = require('gulp-cssnano'),
//     rename = require('gulp-rename'), uglify = require('gulp-uglify'), concat = require('gulp-concat')
//     , imagemin = require('gulp-imagemin'), cache = require('gulp-cache')
// gulp.task('watchs', () => {
//     gulp.watch('./css/*.css', gulp.series('css'))
//     gulp.watch('./*.html', gulp.series('html'))
//     gulp.watch('./js/*.js', gulp.series('js'))
//     gulp.watch('./images/*.*', gulp.series('image'))
// })
// gulp.task('connect', () => {
//     connect.server({
//         root: 'dist/',
//         livereload: true,
//     })
// })
// gulp.task('html', () => {
//     return gulp.src('./*.html')
//         .pipe(gulp.dest('./dist/'))
//         .pipe(connect.reload())
// })
// gulp.task('css', () => {
//     return gulp.src('./css/*.css')
//         .pipe(cssnano())
//         .pipe(rename({ 'suffix': '.min' }))
//         .pipe(gulp.dest('./dist/css/'))
//         .pipe(connect.reload())
// })
// gulp.task('js', () => {
//     return gulp.src('./js/*.js')
//         .pipe(concat('index.js'))
//         .pipe(uglify())
//         .pipe(rename({ 'suffix': '.min' }))
//         .pipe(gulp.dest('./dist/js'))
//         .pipe(connect.reload())
// })
// gulp.task('image', () => {
//     return gulp.src('./images/*.*')
//         .pipe(cache(imagemin()))
//         .pipe(gulp.dest('./dist/images/'))
// })
// gulp.task('default', gulp.parallel('connect', 'watchs', 'html', 'css', 'js'))