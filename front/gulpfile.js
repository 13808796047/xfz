var gulp = require('gulp'), cssnano = require('gulp-cssnano'), rename = require('gulp-rename'),
    uglify = require('gulp-uglify'), concat = require('gulp-concat')
    , imagemin = require('gulp-imagemin'), cache = require('gulp-cache'), bs = require('browser-sync').create();

var path = {
    'html':'./templates/**/',
    'css': './src/css/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};
//处理html任务
gulp.task('html',()=>{
    gulp.src(path.html+'*.html')
        .pipe(bs.stream())
})
//定义一个css任务
gulp.task('css', () => {
    gulp.src(path.css + '*.css')
        .pipe(cssnano())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});
//定义处理js文件的任务
gulp.task('js', () => {
    gulp.src(path.js + '*.js')
        .pipe(uglify())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
})
//定义处理图片文件的任务
gulp.task('images', () => {
    gulp.src(path.images + '*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
})
//定义监听文件修改的任务
gulp.task('watch', () => {
    gulp.watch(path.css + '*.css', gulp.series('css'))
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
gulp.task('default',gulp.parallel('bs', 'watch'))