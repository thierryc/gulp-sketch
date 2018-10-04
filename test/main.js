/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should = require('should');
const sketch = require('../coffee/');
const gutil  = require('gulp-util');
const fs     = require('fs');
const path   = require('path');

const createVinyl = function(file_name, contents) {
  const base = path.join(__dirname, 'fixtures');
  const filePath = path.join(base, file_name);

  return new gutil.File({
    cwd: __dirname,
    base,
    path: filePath,
    contents: contents || fs.readFileSync(filePath)
  });
};

describe('gulp-sketch', () =>
  describe('sketch()', function() {

    this.timeout(10000);

    it('should emit error when file isStream()', function(done) {
      const stream = sketch();
      const streamFile = {
        isNull() { return false; },
        isStream() { return true; }
      };
      stream.on('error', function(err) {
        err.message.should.equal('Streaming not supported');
        return done();
      });
      return stream.write(streamFile);
    });

    it('should export single svg file', function(done) {
      const src = createVinyl('flat.sketch');
      const stream = sketch({
        export: 'slices',
        formats: 'svg'
      });
      stream.on('data', function(dist) {
        should.exist(dist);
        should.exist(dist.path);
        should.exist(dist.relative);
        should.exist(dist.contents);
        dist.path.should.equal(path.join(__dirname, 'fixtures', 'yellow.svg'));
        let actual = dist.contents.toString('utf8');
        actual = actual.replace(/^\s*<!--.*?-->\n/m, ''); // remove Generator comments
        const expected = fs.readFileSync(path.join(__dirname, 'expect', 'yellow.svg'), 'utf8');
        actual.should.equal(expected.trim());
        return done();
      });
      return stream.write(src);
    });

    it('should export single svg file under subdirectory', function(done) {
      const src = createVinyl('subdir.sketch');
      const stream = sketch({
        export: 'slices',
        formats: 'svg'
      });
      stream.on('data', function(dist) {
        should.exist(dist);
        should.exist(dist.path);
        should.exist(dist.relative);
        should.exist(dist.contents);
        dist.path.should.equal(path.join(__dirname, 'fixtures', 'square', 'yellow.svg'));
        let actual = dist.contents.toString('utf8');
        actual = actual.replace(/^\s*<!--.*?-->\n/m, ''); // remove Generator comments
        const expected = fs.readFileSync(path.join(__dirname, 'expect', 'square-yellow.svg'), 'utf8');
        actual.should.equal(expected.trim());
        return done();
      });
      return stream.write(src);
    });

    return it('should export JSON file', function(done) {
      const src = createVinyl('flat.sketch');
      const stream = sketch({
        export: 'slices',
        formats: 'svg',
        outputJSON: 'output.json'
      });
      stream.on('data', function(dist) {
        should.exist(dist);
        should.exist(dist.path);
        should.exist(dist.relative);
        should.exist(dist.contents);
        if (/output\.json$/.test(dist.path)) {
          dist.path.should.equal(path.join(__dirname, 'fixtures', 'output.json'));
          const actual = dist.contents.toString('utf8');
          const expected = fs.readFileSync(path.join(__dirname, 'expect', 'output.json'), 'utf8');
          actual.should.equal(expected);
          return done();
        }
      });
      return stream.write(src);
    });

    /*
    it 'should export single png file', (done) ->
      src = createVinyl 'flat.sketch'
      stream = sketch
        export: 'slices'
        formats: 'png'
        saveForWeb: true
      stream.on 'data', (dist) ->
        should.exist dist
        should.exist dist.path
        should.exist dist.relative
        should.exist dist.contents
        dist.path.should.equal path.join __dirname, 'fixtures', 'yellow.png'
        actual = dist.contents.toString 'hex'
        expected = fs.readFileSync path.join(__dirname, 'expect', 'yellow.png'), 'hex'
        actual.should.equal expected
        done()
      stream.write src

    it 'should export single png file under subdirectory', (done) ->
      src = createVinyl 'subdir.sketch'
      stream = sketch
        export: 'slices'
        formats: 'png'
        saveForWeb: true
      stream.on 'data', (dist) ->
        should.exist dist
        should.exist dist.path
        should.exist dist.relative
        should.exist dist.contents
        dist.path.should.equal path.join __dirname, 'fixtures', 'square', 'yellow.png'
        actual = dist.contents.toString 'hex'
        expected = fs.readFileSync path.join(__dirname, 'expect', 'yellow.png'), 'hex'
        actual.should.equal expected
        done()
      stream.write src
    */
  })
);
