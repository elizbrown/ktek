var YAML = require('yamljs'),
    fs = require('fs'),
    mustache = require('mustache'),
    marked = require('marked'),
    path = require('path'),
    async = require('async');

// Generate tags for the <metadata> section
function metaTag(tagName, value) {
  return mustache.render('<dc:{{tagName}}>{{value}}</dc:{{tagName}}>', {
    tagName: tagName,
    value: value
  });
};
module.exports.metaTag = metaTag;

function maniTag(name) {
  return mustache.render(
    '<item id="{{name}}" media-type="text/x-oeb1-document" href="{{name}}.html"></item>',
    { name: name }
  );
}

// Extracts the first heading from a markdown file to derive what the chapter
// title should be.
function extractMainHeader(text) {
  var tokens = marked.lexer(text, {});
  var found = false;
  var i = 0;
  var heading = 'No Title Specified';
  do {
    if (tokens[i].type === 'heading') {
      heading = tokens[i].text;
      found = true;
    }
    i++;
  } while (i < tokens.length && !found);
  return heading;
}
module.exports.extractMainHeader = extractMainHeader;

var metaKeys = [
  'Title',
  'Language',
  'Creator',
  'Copyrights',
  'Publisher'
];

module.exports.parseFile = function (baseDir, fileName, callback) {
  // Read and parse the manifest YAML file
  fs.readFile(path.join(baseDir, fileName), 'utf8', function (err, data) {
    if (err) {
      console.error('Error opening file', path, ': ', err);
      return callback(err);
    }
    var manifest = YAML.parse(data);

    // Build the metadata tags
    var metaTags = [];
    Object.keys(manifest).forEach(function (key) {
      metaKeys.forEach(function (mkey) {
        if (mkey.toLowerCase() === key) {
          metaTags.push(metaTag(mkey, manifest[key]));
        }
      });
    });
    console.log(metaTags);

    // Build the file manifests
    var manifestTags = [],
        spineTags = [],
        guideTags = [];

    async.forEach(manifest.manifest, function (file, fcb) {
      var fpath = path.join(baseDir, file);
      if (!fs.existsSync(fpath)) {
        console.error('WARNING: File', fpath, 'not found!');
      } else {
        var name = file.replace('.md', '');
        manifestTags.push(maniTag(name));
        spineTags.push(
          mustache.render('<itemref idref="{{name}}"/>', {name: name})
        );
        fs.readFile(fpath, 'utf8', function (err, data) {
          var title = extractMainHeader(data);
          guideTags.push(
            mustache.render('<reference type="text" title="{{title}}" href="{{name}}.html"/>', {
              title: title,
              name: name
            })
          );
          fcb();
        });
      }
    }, function () {
      console.log(manifestTags);
      console.log(spineTags);
      console.log(guideTags);

      callback();
    });
  });
};
