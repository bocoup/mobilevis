/**
 * Remove duplicates from an array.
 */
const dedup = (array) => [...new Set(array)];

module.exports = function(grunt) {
  const submissions = require('../data/submissions.json');
  const users = dedup(submissions.map(({twitter_handle}) => twitter_handle));
  const creators = dedup(submissions.map(({creator}) => creator));
  const tags = dedup(submissions.map(({tags}) => tags.map(({id}) => id)).flat());

  // mobilev.is was originally deployed to a server which responded to all
  // requests for unrecognized resources with the project's `index.html` file.
  // The JavaScript code included in that page inspects the URL and displays
  // the appropriate content.
  //
  // This behavior allows others to link directly to "pages" within the
  // application, even though there is technically only one page.
  //
  // In 2022, this site was re-deployed to a generic file server which cannot
  // be extended with the custom file handling behavior described above. To
  // continue to serve the `index.html` file in response to requests for the
  // application's pages (and thereby preserve links), this Grunt Task copies
  // the file for every resource which could possibly be referenced via URL.
  const pages = [
    ...submissions.map(({id}) => `submission/${id}`),
    ...users.map((id) => `user/${id}`),
    ...creators.map((name) => `creator/${name}`),
    ...tags.map((id) => `tag/${id}`),
    'about',
  ];

  grunt.config.set('copy', {
    public: {
      files: [
        {expand: true, cwd: 'src/assets', src: ['*'], dest: 'public/src/assets/'},
        {expand: true, cwd: 'data', src: ['**'], dest: 'public/data/'},
        ...pages.map((destDir) => ({
           src: 'public/index.html',
           dest: `public/${destDir}/index.html`
         }))
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

};
