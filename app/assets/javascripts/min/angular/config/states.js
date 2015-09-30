homeApp.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("index",{url:"/",views:{profile:{templateUrl:"assets/angular/html/profile/feed.html"},book:{templateUrl:"assets/angular/html/book/_buy.html"},author:{templateUrl:"assets/angular/html/author/books.html"},room:{templateUrl:"assets/angular/html/community/feed.html"}}}).state("author/wiki",{url:"/author/wiki",sticky:!0,deepStateRedirect:!0,views:{author:{templateUrl:"assets/angular/html/author/wiki.html"}}}).state("author/feed",{url:"/author/feed",sticky:!0,deepStateRedirect:!0,views:{author:{templateUrl:"assets/angular/html/author/feed.html"}}}).state("author/books",{url:"/author/books",sticky:!0,deepStateRedirect:!0,views:{author:{templateUrl:"assets/angular/html/author/books.html"}}}).state("author/followers",{url:"/author/followers",sticky:!0,deepStateRedirect:!0,views:{author:{templateUrl:"assets/angular/html/author/followers.html"}}}).state("author/interview",{url:"/author/interview",sticky:!0,deepStateRedirect:!0,views:{author:{templateUrl:"assets/angular/html/author/interview.html"}}}).state("room/books",{url:"/room/books",sticky:!0,deepStateRedirect:!0,views:{room:{templateUrl:"assets/angular/html/community/books.html"}}}).state("room/home",{url:"/room/home",views:{room:{templateUrl:"assets/angular/html/community/feed.html"}}}).state("room/home.year",{url:"/:year",views:{room:{templateUrl:"assets/angular/html/community/feed.html"}}}).state("room/home.month",{url:"/:year/month/:month",views:{room:{templateUrl:"assets/angular/html/community/feed.html"}}}).state("room/videos",{url:"/room/videos",sticky:!0,deepStateRedirect:!0,views:{room:{templateUrl:"assets/angular/html/community/videos.html"}}}).state("room/wiki",{url:"/room/wiki",sticky:!0,deepStateRedirect:!0,views:{room:{templateUrl:"assets/angular/html/community/wiki.html"}}}).state("book/timeline",{url:"/book/timeline",sticky:!0,deepStateRedirect:!0,views:{book:{templateUrl:"assets/angular/html/book/_timeline.html"}}}).state("book/buyandreview",{url:"/book/buyandreview",sticky:!0,deepStateRedirect:!0,views:{book:{templateUrl:"assets/angular/html/book/_buy.html"}}}).state("book/rooms",{url:"/book/rooms",sticky:!0,deepStateRedirect:!0,views:{book:{templateUrl:"assets/angular/html/book/_news.html"}}}).state("book/preview",{url:"/book/preview",sticky:!0,deepStateRedirect:!0,views:{book:{templateUrl:"assets/angular/html/book/_overview.html"}}}).state("profile/feed",{url:"/profile/feed",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/feed.html"}}}).state("profile/history",{url:"/profile/history",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/history.html"}}}).state("profile/news",{url:"/profile/news",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/news.html"}}}).state("profile/rooms",{url:"/profile/rooms",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/rooms.html"}}}).state("profile/books",{url:"/profile/books",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/books.html"}}}).state("profile/followings",{url:"/profile/followings",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/followings.html"}}}).state("profile/followers",{url:"/profile/followers",sticky:!0,deepStateRedirect:!0,views:{profile:{templateUrl:"assets/angular/html/profile/followers.html"}}})}]),homeApp.config(["$mdThemingProvider",function(a){a.definePalette("googleBlue",{50:"4487FF",100:"4485FA",200:"4182F5",300:"427fed",400:"3D7BEA",500:"3066C7",600:"3066C7",700:"3066C7",800:"3066C7",900:"3066C7",A100:"3066C7",A200:"3066C7",A400:"3066C7",A700:"3066C7",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleRed",{50:"F4473B",100:"EF4539",200:"ED4539",300:"E84236",400:"DF4034",500:"D03C31",600:"C73A30",700:"C73A30",800:"C73A30",900:"C73A30",A100:"C73A30",A200:"C73A30",A400:"C73A30",A700:"C73A30",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleGreen",{50:"03A35D",100:"029655",200:"039052",300:"02884D",400:"03844C",500:"009C58",600:"027C47",700:"027C47",800:"027C47",900:"027C47",A100:"027C47",A200:"027C47",A400:"027C47",A700:"027C47",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.theme("default").primaryPalette("blue").accentPalette("googleGreen").warnPalette("googleRed")}]);