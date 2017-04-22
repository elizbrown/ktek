var marked = require('marked'),
    mustache = require('mustache'),
    fs = require('fs-extra'),
    path = require('path');

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function (code) {
    return require('highlightjs').highlightAuto(code).value;
  }
});

// Load the HTML template for chapters
var chapterTemplate = fs.readFileSync(path.resolve(__dirname,
    '../lib/chapter.mustache.html'), 'utf8');

function build(options) {
  fs.readdir('.', function (err, files) {
    files.forEach(function (file) {
      if (file.substring(file.length - 3) === '.md') {
        console.log('Compiling', file, '...');
        fs.readFile(file, 'utf8', function (err, content) {
          var templateData = {
            title: 'Root Scootin Boogie',
            content: marked(content),
            stylesheets: [
              '<link rel="stylesheet" href="highlight-theme.css" />'
            ]
          };
          var resultName = file.replace('.md', '.html');
          fs.writeFile(resultName, mustache.render(chapterTemplate, templateData), function (err) {
            if (err) throw err;
            console.log('Wrote', resultName);
          });
        });
      }
    });
  });
}

module.exports = build;
