module.exports = function(grunt) {

  grunt.config('cssmin', {
    public : {
      files : {
        'public/app.css' : [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'public/app.css'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');

};
