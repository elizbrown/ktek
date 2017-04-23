var fs = require('fs-extra'),
    assert = require('chai').assert,
    initCommand = require('../lib/init');

describe('Init command', function () {
  it('Should create the template project', function (done) {
    initCommand('__test', {}, function (err) {
      assert.isNotOk(err, 'Did not produce an error');
      assert.isOk(fs.existsSync('__test/book.yml'), 'The book.yml file exists');
      done();
    });
  });
});

afterEach(function (done) {
  fs.remove('__test', done);
});
