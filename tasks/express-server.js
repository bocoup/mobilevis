module.exports = function(grunt) {

  grunt.config.set('express', {
    dev: {
      options: {
        script: './app.js',
        background: true,
        port: 8000,
        debug: true,
        args: ['sqlite3']
      }
    }
  });

  grunt.loadNpmTasks('grunt-express-server');

};

