module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: [{
            expand: true,
            cwd: 'src/js',
            src: 'app/assets/javascripts/**/*.js',
            dest: 'dest/js'
        }]
      }
      // options: {
      //   banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      // },
      // build: {
      //   src: 'app/assets/angular/<%= pkg.name %>.js',
      //   dest: 'build/<%= pkg.name %>.min.js'
      // }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  
};