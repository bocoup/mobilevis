const config = require('../../config/api');
const knox = require('knox');
const MultiPartUpload = require('knox-mpu');
const when = require('when');
const _ = require('lodash');

exports.config = config.s3;
exports.client = knox.createClient(config.s3);

exports.writeStream = function (stream, headers) {
  var deferred = when.defer();
  var uuid = require('node-uuid').v4();
  var params = {
    client: exports.client,
    objectName: config.s3.prefix+uuid,
    stream: stream,
    headers: _.extend({ 'x-amz-acl': 'public-read' }, headers)
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
