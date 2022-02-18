module.exports = function(grunt) {
  // Project configuration.

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  // Load Grunt plugins.
  grunt.loadTasks('tasks');

  // Register alias tasks.
  grunt.registerTask('build',
    'Build site files for testing or deployment.',
    ['jshint', 'clean', 'jade:public', 'requirejs:public', 'stylus:public', 'cssmin']);

  grunt.registerTask('dev',
    'Start a live-reloading dev webserver on localhost.',
    ['jshint', 'clean', 'jade:dev', 'stylus:dev', 'cssmin', 'watch']);

  grunt.registerTask('server',
    'Start dev REST server followed by static connect server.',
    function() {
      grunt.task.run('express:dev');
    }
  );



  grunt.registerTask('default', ['dev']);
};
