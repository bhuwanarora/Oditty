module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      minify: {
        expand: true,
        cwd: 'app/assets/stylesheets/website/',
        src: ['*.css', '!*.min.css', '*.css.scss'],
        dest: 'app/assets/stylesheets/min/',
        ext: '.min.css'
      },
      combine: {
        files: {
          'app/assets/stylesheets/min/site.min.css': [
            'app/assets/stylesheets/min/website.min.css',
            'app/assets/stylesheets/min/cropme.min.css',
            'app/assets/stylesheets/min/animate.min.css',
            'app/assets/stylesheets/min/icomoon.min.css',
            'app/assets/stylesheets/min/search_page.min.css',
            'app/assets/stylesheets/min/recommendation.min.css',
            'app/assets/stylesheets/min/focused_tooltip.min.css',
            'app/assets/stylesheets/min/info_card.min.css',
            'app/assets/stylesheets/min/book.min.css'
          ]
        }
      }
    },
    // htmlmin: {                                     // Task
    //   dist: {                                      // Target
    //     options: {                                 // Target options
    //       removeComments: true,
    //       removeCommentsFromCDATA: true,
    //       collapseWhitespace: true,
    //       minifyJS: true,
    //       minifyCSS: true
    //     },
    //     files: {                                   // Dictionary of files
    //       'app/assets/javascripts/angular/widgets/gzip/base/**/*.html': 'app/assets/javascripts/angular/widgets/base/.html'
    //       // 'dist/contact.html': 'src/contact.html'
    //     }
    //   }
    // },
    // compress: {
    //   main: {
    //     options: {
    //       mode: 'gzip'
    //     },
    //     files: [
    //       {
    //         expand: true,
    //         cwd: 'app/assets/javascripts/angular/widgets/base/',
    //         src: ['**/*'],
    //         dest: 'app/assets/javascripts/angular/widgets/gzip/base',
    //         ext: '.gz'
    //       },
    //       {
    //         expand: true,
    //         cwd: 'app/assets/javascripts/angular/widgets/partials/',
    //         src: ['**/*'],
    //         dest: 'app/assets/javascripts/angular/widgets/gzip/partials/',
    //         ext: '.gz'
    //       }
          
    //     ]
    //   }
    // },
    ngtemplates:{
      app:{
        src: 'app/assets/javascripts/angular/widgets/**/*.html',
        dest: 'app/assets/javascripts/min/angular/templates.js',
        options:{
          module: 'websiteApp',
          htmlmin:{ 
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
          },
          url: function(url) { return url.replace('app/assets/javascripts/', '/assets/'); }
        }
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      my_target: {
        files: [{
            expand: true,
            cwd: 'app/assets/javascripts/angular/',
            src: '**/*.js',
            dest: 'app/assets/javascripts/min/angular'
          },
          {
            expand: true,
            cwd: 'app/assets/javascripts/lib/',
            src: '**/*.js',
            dest: 'app/assets/javascripts/min/lib'
          },
          {
            'app/assets/javascripts/min/angular/templates.min.js' : [
              'app/assets/javascripts/min/angular/templates.js']
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      basic_and_extras: {
        files: {
          'app/assets/javascripts/min/angular/controllers.js': [
          'app/assets/javascripts/min/angular/controllers/book_timeline_controller.js', 
          'app/assets/javascripts/min/angular/controllers/recommendations_controller.js',
          'app/assets/javascripts/min/angular/controllers/search_controller.js',
          'app/assets/javascripts/min/angular/controllers/timeline_controller.js',
          'app/assets/javascripts/min/angular/controllers/website_controller.js'],

          'app/assets/javascripts/min/angular/services.js': [
          'app/assets/javascripts/min/angular/services/recommendation_service.js', 
          'app/assets/javascripts/min/angular/services/website_service.js',
          'app/assets/javascripts/min/angular/services/widget_service.js'],

          'app/assets/javascripts/min/angular/directives.js': [
          'app/assets/javascripts/min/angular/directives/recommendation_directives.js', 
          'app/assets/javascripts/min/angular/directives/website_directives.js',
          'app/assets/javascripts/min/angular/directives/book_directives.js',
          'app/assets/javascripts/min/angular/directives/recommendations/book_widget_app_directives.js',
          'app/assets/javascripts/min/angular/directives/recommendations/author_widget_app_directives.js',
          'app/assets/javascripts/min/angular/directives/recommendations/reader_widget_app_directives.js',
          'app/assets/javascripts/min/angular/directives/recommendations/widget_app_directives.js'],

          'app/assets/javascripts/min/angular/libs.js': [
            'app/assets/javascripts/min/lib/angular_scroll.min.js',
            'app/assets/javascripts/min/lib/hash.js',
            'app/assets/javascripts/min/lib/text_angular.min.js'],

          'app/assets/javascripts/min/angular/apps.js': [
            'app/assets/javascripts/min/angular/apps/website_app.js',
            'app/assets/javascripts/min/angular/apps/filters_app.js'],


          'app/assets/javascripts/min/angular/vendors.js': [
            'app/assets/javascripts/angular/vendors/angular_animate.min.js',
            'app/assets/javascripts/angular/vendors/angular-adaptive-motion.min.js',
            'app/assets/javascripts/angular/vendors/angular_dropdown.js',
            'app/assets/javascripts/angular/vendors/angular_google_map.js',
            'app/assets/javascripts/angular/vendors/angular_facebook.js',
            'app/assets/javascripts/angular/vendors/google_map.js',
            'app/assets/javascripts/angular/vendors/angular_mousewheel.min.js',
            'app/assets/javascripts/angular/vendors/angular_router.min.js',
            'app/assets/javascripts/angular/vendors/cropme.js',
            'app/assets/javascripts/angular/vendors/google_plus_signin.js',
            'app/assets/javascripts/angular/vendors/hamster.min.js',
            'app/assets/javascripts/angular/vendors/sticky.js'],

          'app/assets/javascripts/min/angular/main.js': [
            'app/assets/javascripts/angular/vendors/angular.min.js',
            'app/assets/javascripts/min/angular/vendors.js',
            'app/assets/javascripts/min/angular/libs.js',
            'app/assets/javascripts/min/angular/apps.js',
            'app/assets/javascripts/min/angular/directives.js',
            'app/assets/javascripts/min/angular/controllers.js',
            'app/assets/javascripts/min/angular/services.js',
            'app/assets/javascripts/min/angular/templates.min.js'
          ]
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-contrib-compress');
  // grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-angular-templates');


  // Default task(s).
  grunt.registerTask('default', ['cssmin', 'ngtemplates', 'uglify', 'concat']);
  
};