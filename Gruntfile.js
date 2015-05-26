module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            minify: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/assets/stylesheets/website/',
                        src: ['*.css', '!*.min.css', '*.css.scss'],
                        dest: 'app/assets/stylesheets/min/website/',
                        ext: '.min.css'
                    },
                    {
                        expand: true,
                        cwd: 'app/assets/stylesheets/landing_page/',
                        src: ['*.css', '!*.min.css', '*.css.scss'],
                        dest: 'app/assets/stylesheets/min/landing_page/',
                        ext: '.min.css'
                    },
                    {
                        expand: true,
                        cwd: 'app/assets/stylesheets/',
                        src: ['angular_material.css'],
                        dest: 'app/assets/stylesheets/min/',
                        ext: '.min.css'
                    }
                ]
            },
            combine: {
                files: {
                    'app/assets/stylesheets/min/site.min.css': [
                        'app/assets/stylesheets/min/angular_material.min.css',
                        'app/assets/stylesheets/min/website/website.min.css',
                        'app/assets/stylesheets/min/website/icomoon.min.css',
                        'app/assets/stylesheets/min/website/home.min.css',
                        'app/assets/stylesheets/min/website/media_library.min.css'
                    ],

                    'app/assets/stylesheets/min/landing_page_site.min.css': [
                        'app/assets/stylesheets/min/angular_material.min.css',
                        'app/assets/stylesheets/min/landing_page/style.min.css',
                        'app/assets/stylesheets/min/landing_page/media.min.css',
                        'app/assets/stylesheets/min/website.min.css',
                        'app/assets/stylesheets/min/landing_page/animate.min.css',
                        'app/assets/stylesheets/min/icomoon.min.css'
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
            src: 'app/assets/javascripts/angular/html/**/*.html',
            dest: 'app/assets/javascripts/min/angular/templates.js',
            options:{
              module: 'homeApp',
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
                'app/assets/javascripts/min/angular/services.js': [
                    "app/assets/javascripts/min/angular/services/third_party/d3_service.js",
                    "app/assets/javascripts/min/angular/services/search_service.js",
                    "app/assets/javascripts/min/angular/services/status_service.js",
                    "app/assets/javascripts/min/angular/services/feed_service.js",
                    "app/assets/javascripts/min/angular/services/user_service.js",
                    "app/assets/javascripts/min/angular/services/genre_service.js",
                    "app/assets/javascripts/min/angular/services/book_service.js",
                    "app/assets/javascripts/min/angular/services/author_service.js",
                    "app/assets/javascripts/min/angular/services/shelf_service.js",
                    "app/assets/javascripts/min/angular/services/infinity_service.js",
                    "app/assets/javascripts/min/angular/services/network_service.js",
                    "app/assets/javascripts/min/angular/services/shared_service.js"
                ],

                'app/assets/javascripts/min/angular/controllers.js': [
                    "app/assets/javascripts/min/angular/controllers/app_controller.js",
                    "app/assets/javascripts/min/angular/controllers/notification_controller.js",
                    "app/assets/javascripts/min/angular/controllers/search_controller.js",
                    "app/assets/javascripts/min/angular/controllers/home/left_controller.js",
                    "app/assets/javascripts/min/angular/controllers/home/right_controller.js",
                    "app/assets/javascripts/min/angular/controllers/home/shelf_controller.js",
                    "app/assets/javascripts/min/angular/controllers/book/buy_controller.js",
                    "app/assets/javascripts/min/angular/controllers/recommend_controller.js",
                    "app/assets/javascripts/min/angular/controllers/share/share_controller.js",
                    "app/assets/javascripts/min/angular/controllers/share/options_controller.js",
                    "app/assets/javascripts/min/angular/controllers/profile_controller.js",
                    "app/assets/javascripts/min/angular/controllers/toast_controller.js",
                    'app/assets/javascripts/min/angular/controllers/home/list_bottom_sheet_controller.js',
                    "app/assets/javascripts/min/angular/controllers/book/specific_book_controller.js",
                    "app/assets/javascripts/min/angular/controllers/book/timeline_controller.js",
                    "app/assets/javascripts/min/angular/controllers/book/real_virtuality_controller.js"
                ],

                'app/assets/javascripts/min/angular/directives.js': [
                    "app/assets/javascripts/min/angular/directives/site_directives.js"
                ],

                'app/assets/javascripts/min/angular/landing_page_vendors.js': [
                    'app/assets/javascripts/min/angular/vendors/hammer.js',
                    'app/assets/javascripts/min/angular/vendors/angular-aria.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_mousewheel.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_router.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_material.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_cookies.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_facebook.js',
                    'app/assets/javascripts/min/angular/vendors/angular-timer.min.js'
                ],

                'app/assets/javascripts/min/angular/vendors.min.js': [
                    'app/assets/javascripts/min/angular/vendors/angular.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_messages.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_animate.min.js',
                    'app/assets/javascripts/min/angular/landing_page_vendors.js',
                    'app/assets/javascripts/min/angular/vendors/angular-sanitize.min.js',
                    'app/assets/javascripts/min/lib/angular_scroll.min.js',
                    'app/assets/javascripts/min/angular/vendors/angular_filters.min.js',
                    "app/assets/javascripts/min/angular/vendors/angular-parallax.min.js"
                ],

                'app/assets/javascripts/min/angular/apps.js': [
                    "app/assets/javascripts/min/angular/apps/home_app.js",
                    "app/assets/javascripts/min/angular/apps/filters_app.js",
                    "app/assets/javascripts/min/angular/apps/app_constants.js",
                ],

                'app/assets/javascripts/min/angular/landing_page.min.js': [
                    'app/assets/javascripts/min/angular/apps/landing_page_app.js',
                    'app/assets/javascripts/min/angular/apps/app_constants.js',
                    'app/assets/javascripts/min/angular/services/website_service.js',
                    'app/assets/javascripts/min/angular/controllers/landing_page_controller.js',  
                    'app/assets/javascripts/min/angular/controllers/signup_controller.js',
                ],

                'app/assets/javascripts/min/angular/site.min.js': [
                    'app/assets/javascripts/min/angular/vendors.min.js',
                    'app/assets/javascripts/min/angular/apps.js',
                    'app/assets/javascripts/min/angular/services.js',
                    'app/assets/javascripts/min/angular/directives.js',
                    'app/assets/javascripts/min/angular/controllers.js',
                    'app/assets/javascripts/min/angular/templates.min.js'
                ],

                "app/assets/javascripts/min/angular/d3_group.min.js": [
                    "app/assets/javascripts/min/angular/vendors/jquery.min.js",
                    "app/assets/javascripts/min/angular/vendors/d3.min.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/d3_transform.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/extarray.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/misc.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/micro-observer.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/microplugin.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/bubble-chart.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/central-click.js",
                    "app/assets/javascripts/min/angular/vendors/bubble_chart/lines.js",
                    "app/assets/javascripts/min/angular/directives/d3_directives.js"
                ],

                "app/assets/javascripts/min/angular/controllers/home_group.min.js":[
                    "app/assets/javascripts/min/angular/services/news_service.js",
                    "app/assets/javascripts/min/angular/directives/home_directives.js",
                    "app/assets/javascripts/min/angular/controllers/home/home_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/network_group.min.js":[
                    "app/assets/javascripts/min/angular/controllers/network_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/news_group.min.js":[
                    "app/assets/javascripts/min/angular/directives/news_directives.js",
                    "app/assets/javascripts/min/angular/services/news_service.js",
                    "app/assets/javascripts/min/angular/controllers/news_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/community_group.min.js":[
                    "app/assets/javascripts/min/angular/services/news_service.js",
                    "app/assets/javascripts/min/angular/controllers/community_controller.js"
                ],                

                "app/assets/javascripts/min/angular/controllers/customise_group.min.js":[
                    "app/assets/javascripts/min/angular/controllers/customise/customise_controller.js",
                    "app/assets/javascripts/min/angular/controllers/customise/info_controller.js",
                    "app/assets/javascripts/min/angular/controllers/customise/genres_controller.js",
                    "app/assets/javascripts/min/angular/controllers/customise/books_controller.js",
                    "app/assets/javascripts/min/angular/controllers/customise/authors_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/book_group.min.js":[
                    
                ],

                "app/assets/javascripts/min/angular/controllers/infinity_group.min.js":[
                    "app/assets/javascripts/min/angular/services/time_group_service.js",
                    "app/assets/javascripts/min/angular/services/reading_time_service.js",
                    "app/assets/javascripts/min/angular/controllers/library/library_controller.js",
                    "app/assets/javascripts/min/angular/controllers/library/filters_controller.js"
                    
                ],

                "app/assets/javascripts/min/angular/controllers/room_group.min.js":[
                    "app/assets/javascripts/min/angular/directives/room_directives.js",
                    "app/assets/javascripts/min/angular/services/room_service.js",
                    "app/assets/javascripts/min/angular/controllers/room/room_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/author_group.min.js":[
                    "app/assets/javascripts/min/angular/controllers/author_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/profile_group.min.js":[
                    "app/assets/javascripts/min/angular/directives/profile_directives.js",
                    "app/assets/javascripts/min/angular/services/news_service.js",
                    "app/assets/javascripts/min/angular/controllers/profile_controller.js"
                ],

                "app/assets/javascripts/min/angular/controllers/search_group.min.js":[
                    "app/assets/javascripts/min/angular/controllers/search_page_controller.js"
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