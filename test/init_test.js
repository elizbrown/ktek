var assert = require('chai').assert,
    initCommand = require('../lib/init');

describe('Init command', function (done) {
  it('Should create the template project', function () {
    initCommand('__test', {}, function (err) {
      assert.isNotOk(err, 'Did not produce an error');
      done();
    });
  });
});
