var Multer = require('multer');
var path = require('path');
var dummyRandomString = require('./../util/dummyRandomString');

var rangement = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve( __dirname, '../public/images/'));
  },
  filename: function (req, file, cb) {
    var name = dummyRandomString();
    console.log('?');
    cb(null, name);
  },
  limits: {fileSize: 1000000, files:1},
});
var uploadHandler = Multer({ storage: rangement });

module.exports = uploadHandler;
