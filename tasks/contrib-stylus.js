module.exports = function(grunt) {

  grunt.config('stylus', {
    options: {
      'include css': true,
      paths: ['src/styles'],
      import: ['nib', 'shared'],
    },
    dev: {
      options: {
        compress: false,
      },
      src: [
        'src/styles/app.styl',
        'src/modules/**/*.styl',
      ],
      dest: 'public/app.css',
    },
    public: {
      options: {
        compress: false,
      },
      src: '<%= stylus.dev.src %>',
      dest: '<%= stylus.dev.dest %>',
    },
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};
