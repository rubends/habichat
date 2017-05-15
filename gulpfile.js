var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var util = require('gulp-util');

gulp.task('default', function() {
    return gulp.src('style/*.less')
        .pipe(watch('style/*.less'))
        .pipe(less())
        .pipe(gulp.dest('style/'))
        .pipe(less().on('error', util.log));
});