module.exports = function(grunt) {

  grunt.config('simplemocha', {
    options: {
      timeout: 3000,
      ui: 'bdd',
      reporter: 'spec',
    },

    db: {
      src: ['api/test/test.js']
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
};