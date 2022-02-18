module.exports = function(grunt) {

  grunt.config.set('copy', {
    public: {
      files: [
        {expand: true, cwd: 'src/assets', src: ['*'], dest: 'public/assets/'},
        {expand: true, cwd: 'data', src: ['**'], dest: 'public/data/'},
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

};
