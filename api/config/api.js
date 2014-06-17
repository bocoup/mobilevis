module.exports = {

  // default locale is english. We don't actually have support for any other...
  locale: 'en',

  // not debugging by default.
  debug: (process.env.NODE_ENV !== 'development'),

  // current API prefix.
  prefix: '/api/v1'
};