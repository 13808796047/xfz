var gulp = require('gulp'),cssnano = require('gulp-cssnano'),rename=require('gulp-rename'),uglify = require('gulp-uglify'), concat = require('gulp-concat')
    , imagemin = require('gulp-imagemin'), cache = require('gulp-cache'),bs = require('browser-sync').create();

var path = {
    'css':'./src/css/',
    'js':'./src/js/',
    'images':'./src/images/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'images_dist':'./dist/images/'
};
//定义一个css任务
gulp.task('css',()=>{

});