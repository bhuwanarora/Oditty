homeApp.config(["$routeProvider", function($routeProvider){
    $routeProvider.when('/discover', {
        templateUrl : 'assets/angular/views/landing_page/discover.html',
    })
    .when('/wiki', {
        templateUrl : 'assets/angular/html/author/wiki.html',
    })
    .when('/feed', {
        templateUrl : 'assets/angular/html/author/feed.html',
    })
    .when('/books', {
        templateUrl : 'assets/angular/html/author/books.html',
    })
    .when('/followers', {
        templateUrl : 'assets/angular/html/author/followers.html',
    })
    .when('/interview', {
        templateUrl : 'assets/angular/html/author/interview.html',
    })
    .when('/book/timeline', {
        templateUrl : 'assets/angular/html/book/_timeline.html',
    })
    .when('/book/buyandreview', {
        templateUrl : 'assets/angular/html/book/_buy.html',
    })
    .when('/book/realvirtuality', {
        templateUrl : 'assets/angular/html/book/_news.html',
    })
    .when('/book/preview', {
        templateUrl : 'assets/angular/html/book/_overview.html',
    })
    .when('/room/books', {
        templateUrl : 'assets/angular/html/community/books.html',
    })
    .when('/room/home', {
        templateUrl : 'assets/angular/html/community/feed.html',
    })
    .when('/room/videos', {
        templateUrl : 'assets/angular/html/community/videos.html',
    })
    .when('/room/wiki', {
        templateUrl : 'assets/angular/html/community/wiki.html',
    })
    .when('/profile/feed', {
        templateUrl : 'assets/angular/html/profile/feed.html',
    })
    .when('/profile/followers', {
        templateUrl : 'assets/angular/html/profile/followers.html',
    })
    .when('/profile/followings', {
        templateUrl : 'assets/angular/html/profile/followings.html',
    })
    .when('/profile/books', {
        templateUrl : 'assets/angular/html/profile/books.html',
    })
    .when('/profile/rooms', {
        templateUrl : 'assets/angular/html/profile/rooms.html',
    })
    .when('/profile/news', {
        templateUrl : 'assets/angular/html/profile/news.html',
    })
    .when('/profile/history', {
        templateUrl : 'assets/angular/html/profile/history.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/html/shared/default.html'
    });
}]);

homeApp.config(["$mdThemingProvider", function($mdThemingProvider){
    $mdThemingProvider.definePalette('googleBlue', {
        '50': '4487FF',
        '100': '4485FA',
        '200': '4182F5',
        '300': '427fed',
        '400': '3D7BEA',
        '500': '3066C7',
        '600': '3066C7',
        '700': '3066C7',
        '800': '3066C7',
        '900': '3066C7',
        'A100': '3066C7',
        'A200': '3066C7',
        'A400': '3066C7',
        'A700': '3066C7',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('googleRed', {
        '50': 'F4473B',
        '100': 'EF4539',
        '200': 'ED4539',
        '300': 'E84236',
        '400': 'DF4034',
        '500': 'D03C31',
        '600': 'C73A30',
        '700': 'C73A30',
        '800': 'C73A30',
        '900': 'C73A30',
        'A100': 'C73A30',
        'A200': 'C73A30',
        'A400': 'C73A30',
        'A700': 'C73A30',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('googleGreen', {
        '50': '03A35D',
        '100': '029655',
        '200': '039052',
        '300': '02884D',
        '400': '03844C',
        '500': '009C58',
        '600': '027C47',
        '700': '027C47',
        '800': '027C47',
        '900': '027C47',
        'A100': '027C47',
        'A200': '027C47',
        'A400': '027C47',
        'A700': '027C47',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
                      .primaryPalette('blue')
                      .accentPalette('googleGreen')
                      .warnPalette('googleRed')
}]);