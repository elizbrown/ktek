var opf = require('../lib/opf'),
    assert = require('chai').assert;

describe('OPF generator', function () {
  it('Should generate metadata tags', function () {
    assert.equal(opf.metaTag('Language', 'en'),
        '<dc:Language>en</dc:Language>', 'Language tag is correct');
  });

  it('Should extract headings from markdown', function () {
    assert.equal(opf.extractMainHeader('# foo'), 'foo',
      'Basic heading');

    assert.equal(opf.extractMainHeader('foo\n==='), 'foo',
      'GitHub-style implicit heading');

    assert.equal(opf.extractMainHeader('> hoot\n# foo'), 'foo',
      'Heading is not first tag');

    assert.equal(opf.extractMainHeader('> foo'), 'No Title Specified',
      'Heading is missing');
  });

  it('Should process valid YAML manifest', function (done) {
    opf.parseFile('templates/default', 'book.yml', done);
  });
});
