const config = require('../../config/api');
const BaseModel = require('endpoints-model')({
  Bookshelf: require('./database'),
  Validator: require('./validations'),
  linkPrefix: config.prefix
});

module.exports = BaseModel;