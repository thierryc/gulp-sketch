/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gulp = require('gulp');
const sketch = require('./src/');

gulp.task('default', () =>
  gulp.src('./coffee/index.js')
  .pipe(gulp.dest('./'))
);

gulp.task('test-flat', () =>
  gulp.src('./test/fixtures/flat.sketch')
  .pipe(sketch({
    export: 'slices',
    formats: 'png',
    saveForWeb: true
  })).pipe(gulp.dest('./tmp/test/flat'))
);

gulp.task('test-subdir', () =>
  gulp.src('./test/fixtures/subdir.sketch')
  .pipe(sketch({
    export: 'slices',
    formats: 'png',
    saveForWeb: true
  })).pipe(gulp.dest('./tmp/test/subdir'))
);

gulp.task('test-svg', () =>
  gulp.src('./test/fixtures/flat.sketch')
  .pipe(sketch({
    export: 'slices',
    formats: 'svg'
  })).pipe(gulp.dest('./tmp/test/svg'))
);

gulp.task('test-svg-subdir', () =>
  gulp.src('./test/fixtures/subdir.sketch')
  .pipe(sketch({
    export: 'slices',
    formats: 'svg'
  })).pipe(gulp.dest('./tmp/test/svg-subdir'))
);

gulp.task('test-json', () =>
  gulp.src('./test/fixtures/flat.sketch')
  .pipe(sketch({
    export: 'slices',
    formats: 'png',
    saveForWeb: true,
    outputJSON: 'data.json'
  })).pipe(gulp.dest('./tmp/test/json'))
);

gulp.task('test', ['test-json', 'test-svg-subdir', 'test-svg', 'test-subdir', 'test-flat']);
