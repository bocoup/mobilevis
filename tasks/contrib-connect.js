module.exports = function(grunt) {

  grunt.config.set('connect', {
    options: {
      port: 8000,
      hostname: '*'
    },
    dev: {
      options: {
        base: ['public', '.']
      }
    },
    public: {
      options: {
        base: ['public'],
        keepalive: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

};