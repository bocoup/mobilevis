module.exports = function(grunt) {

  grunt.config('watch', {
    livereload: {
      options: {
        livereload: true,
      },
      files: [
        'src/**/*.{js,html}',
        'public/**/*'
      ],
      tasks: [],
    },
    jshintrc: {
      files: ['**/.jshintrc'],
      tasks: ['jshint'],
    },
    build: {
      files: ['<%= jshint.build.src %>'],
      tasks: ['jshint:build'],
    },
    scripts: {
      files: ['<%= jshint.app.src %>'],
      tasks: ['jshint:app'],
    },
    styles: {
      files: ['src/styles/*.styl',' src/**/*.styl'],
      tasks: ['stylus:dev'],
    },
    pages: {
      files: ['src/pages/*.jade'],
      tasks: ['jade:dev'],
    },
    api: {
      files: ['server/src/**/*.{js,html}'],
      tasks: ['express:dev'],
      options: {
        spawn: false // Without this option specified express won't be reloaded
      }
    },
    db: {
      files: ['server/db/**/*.js', 'test/db/**/*.js'],
      tasks: ['simplemocha:db']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

};
