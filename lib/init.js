/**
 * The init command creates a new project based on one of the template projects.
 */

var path = require('path'),
    fs = require('fs'),
    ncp = require('ncp'),
    request = require('request');

var templateDir = path.resolve(__dirname, '../templates/default');

function init(name, options, callback) {
  if (!callback) {
    callback = function() {};
  }
  // Copy the template directory to a new folder with the specified name
  ncp(templateDir, "./"+name, function (err) {
    if (err) return callback(err);
    // Fetch a stylesheet for code highlighting from a CDN
    request.get('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css',
      function (err, res, data) {
        if (err) return callback(err);
        fs.writeFile(path.join(name, 'highlight-theme.css'), data, function (err) {
          if (err) return callback(err);
          callback();
        });
      });
  });
}

module.exports = init;
