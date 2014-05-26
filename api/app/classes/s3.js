const config = require('../../config/s3');
const knox = require('knox');
const MultiPartUpload = require('knox-mpu');
const when = require('when');
const _ = require('lodash');
const mime = require('mime');

exports.config = config;
exports.client = knox.createClient(config);

exports.writeStream = function (stream, filename, headers) {
  var deferred = when.defer();
  var uuid = require('node-uuid').v4();

  console.log("content type", mime.lookup(filename));

  var params = {
    client: exports.client,
    objectName: config.prefix+uuid,
    stream: stream,
    headers: _.extend({
      'x-amz-acl': 'public-read',
      'Content-Type': mime.lookup(filename)
    }, headers)
  };
  new MultiPartUpload(params, function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(uuid);
    }
  });
  return deferred.promise;
};

exports.destroy = function(paths, headers) {
  var deferred = when.defer();

  var req = exports.client.deleteMultiple(paths, function(err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(paths); // paths removed! win.
    }
  });

  return deferred.promise;
};
