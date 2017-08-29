const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

// task
gulp.task('compile', function () {

    browserify({
        entries: ['./src/plugin.js'],
        debug: true
    })
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('chat-engine-emoji.js'))
    .pipe(gulp.dest('./dist'))

});

gulp.task('default', ['compile']);

gulp.task('watch', function() {
  gulp.watch('./src/*', ['compile']);
});
