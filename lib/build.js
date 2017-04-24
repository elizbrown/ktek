var marked = require('marked'),
    mustache = require('mustache'),
    fs = require('fs-extra'),
    path = require('path'),
    async = require('async'),
    opf = require('./opf');

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function (code) {
    return require('highlightjs').highlightAuto(code).value;
  }
});

// Load the HTML template for chapters
var chapterTemplate = fs.readFileSync(path.resolve(__dirname,
    '../lib/chapter.mustache.html'), 'utf8');

function compileMarkdown(callback) {
  fs.readdir('.', function (err, files) {
    if (err) { return callback(err) }
    async.forEach(files, function (file, fcb) {
      if (file.substring(file.length - 3) === '.md') {
        console.log('Compiling', file, '...');
        fs.readFile(file, 'utf8', function (err, content) {
          if (err) { return fcb(err) }
          var templateData = {
            title: opf.extractMainHeader(content),
            content: marked(content),
            stylesheets: [
              '<link rel="stylesheet" href="highlight-theme.css" />'
            ]
          };
          var resultName = file.replace('.md', '.html');
          fs.writeFile(resultName, mustache.render(chapterTemplate, templateData), function (err) {
            if (err) { return fcb(err) };
            console.log('Wrote', resultName);
            fcb();
          });
        });
      } else {
        fcb();
      }
    }, function (err) {
      console.log('Done with markdown');
      callback(err);
    });
  });
}

function build(options, callback) {
  if (!callback) { callback = function () {} }
  compileMarkdown(function (err) {
    opf.parseFile('.', 'book.yml', function (err, opfContent) {
      if (err) { return callback(err) }
      fs.writeFile('book.opf', opfContent, function (err) {
        if (err) { return callback(err) }
        console.log('Wrote book.opf');
        callback();
      });
    });
  });
}

module.exports = build;
