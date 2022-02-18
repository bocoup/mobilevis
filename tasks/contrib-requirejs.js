module.exports = function(grunt) {

  grunt.config('requirejs', {
    public: {
      options: {
        baseUrl: 'src',
        mainConfigFile: 'src/requirejs/config.js',
        include: ['requirejs/config'],
        insertRequire: ['requirejs/config'],
        name: '../bower_components/alameda/alameda',
        out: 'public/main.js',
        optimize: 'uglify2',
        generateSourceMaps: true,
        preserveLicenseComments: false,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

};
