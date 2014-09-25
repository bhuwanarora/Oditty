function notify(a,b,c){var d=b.split("-"),e=d[0];"SUCCESS"==e?(a.message_type=0,a.message_style={"background-color":"#f9edbe"}):"ALERT"==e?(a.message_type=1,a.message_style={"background-color":"#d73d32"}):(a.message_type=2,a.message_style={"background-color":"#427fed"}),a.message=d.slice(1,d.length).join("-"),a.notification_active=!0;var f=c(function(){a.notification_active=!1,a.message=""},7e3);return f}function get_size(){"number"==typeof window.innerWidth?(window_width=window.innerWidth,window_height=window.innerHeight):document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?(window_width=document.documentElement.clientWidth,window_height=document.documentElement.clientHeight):document.body&&(document.body.clientWidth||document.body.clientHeight)&&(window_width=document.body.clientWidth,window_height=document.body.clientHeight)}var websiteApp=angular.module("websiteApp",["ngRoute","ngAnimate","monospaced.mousewheel","facebook","ngMap","cropme","duScroll","filtersApp","ngCookies","ngTouch","angular-intro","appConstants"]);websiteApp.config(["$routeProvider","$locationProvider",function(a){a.when("/search",{templateUrl:"/assets/angular/widgets/partials/search.html"}).when("/user/:id",{templateUrl:"/assets/angular/widgets/partials/search.html"}).when("/user/:id/recommendations/:type",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/recommendations/:type/filter/:filter_id/name/:name",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/recommendations/:type/label/:label_id/name/:name",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/grid/:type/id/:grid_id/name/:name",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/trending/:type/id/:trend_id/name/:name",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:title/author/:author",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:title/all/:status",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:book_id",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:title/author/:author/id/:book_id",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/reader/:id/:type",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/",{templateUrl:"/assets/angular/widgets/partials/search.html"}).otherwise({templateUrl:"/assets/angular/widgets/partials/search.html"})}]),websiteApp.constant("facebookAppId","667868653261167"),websiteApp.run(["$rootScope","$location","$cookieStore","$cookies","$http",function(a,b,c){a.$on("$routeChangeStart",function(d,e){var f=!a.user.logged&&!c.get("logged");f&&("/assets/angular/widgets/partials/search.html"==e.templateUrl||b.path("/search"))})}]),angular.element(document).ready(function(){angular.bootstrap(document,["websiteApp"])}),websiteApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]);var window_width=0,window_height=0;get_size();;angular.module("filtersApp",[]).filter("integer",function(){return function(a){var b=a;return angular.isDefined(a)?a>=1e6?b=(a/1e6).toFixed(0)+"m":a>=1e3&&(b=(a/1e3).toFixed(0)+"k"):b=0,b}}).filter("trending_name",function(){return function(a){return angular.isDefined(a)&&(a="#"+a.replace(" ","")),a}}).filter("reduced_label",function(){return function(a){return angular.isDefined(a)&&a.length>20&&(a=a.slice(0,20)+"..."),a}}).filter("first_name",function(){return function(a){return angular.isDefined(a)&&(a=a.split(" ")[0]),a}}).filter("reduced_title",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>28&&(a=a.slice(0,25)+"..."),a}}).filter("reduced_summary",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>85&&(a=a.slice(0,80)+"..."),a}}).filter("compressed_filter",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>7&&(a=a.slice(0,7)+".."),a}}).filter("choose_medium_thumb",function(){return function(a){var b="";if(angular.isDefined(a)){var c=angular.isDefined(a.external_thumb)&&null!=a.external_thumb;if(c)b=a.external_thumb;else if(a.isbn){var d=a.isbn.split(",");b="http://covers.openlibrary.org/b/isbn/"+d[0]+"-M.jpg"}}return b}}).filter("summary",function(){return function(a){var b=a;return angular.isDefined(a)&&""!=a&&null!=a&&(b="<span><b>"+a[0]+"</b></span><span class='light_grey_color'>"+a.substring(1,80)+"</span><span>"+a.substring(80,a.length)+"</span>"),b}}).filter("header_title",function(){return function(a){return output=a,(angular.isUndefined(a)||""==a)&&(output="Recommendations"),output}}).filter("heading",function(){return function(a){var b=a;if(angular.isDefined(a)){a.length>40&&(a=a.slice(0,37)+"..."),a=a.split(" "),b="<span>&nbsp;</span>";for(var c=0;c<a.length;c++){var d=a[c];b=b+"<span><b>"+d[0]+"</b><span>"+d.substring(1,d.length)+"</span> "}}return b}}).filter("rating",function(){return function(a){if(angular.isDefined(a))var b=a.toFixed(1);return b}}).filter("book_title",function(){return function(a){return angular.isDefined(a)&&a.length>50&&(a=a.slice(0,47)+"..."),a}}).filter("book_tag",function(){return function(a){return angular.isDefined(a)&&a.length>28&&(a=a.slice(0,25)+"..."),a}}).filter("published_year",function(){return function(a){var b=a.split(" "),a=b[b.length-1];a=parseInt(a);var c=a>658&&1100>a,d=a>1100&&1500>a,e=a>1500&&1660>a,f=a>1660&&1798>a,g=a>1798&&1837>a,h=a>1837&&1901>a,i=a>1901&&1939>a,j=a>1939&&2e3>a,k=a>2e3&&2014>a;return output=c?"Old English Literature":d?"Middle English Literature":e?"English Renaissance":f?"Neo Classical Period":g?"Romanticism":h?"Victorian Literature":i?"Modernism":j?"Post Modern Literature":k?"20th Century Literature":"Invalid"}}).filter("page_count",function(){return function(a){var b="-"+a+" pages";return(angular.isUndefined(a)||0==a)&&(b=""),b}}).filter("message",function(){return function(a){return a.length>55,a}}).filter("reverse",function(){return function(a){var b=a;return angular.isDefined(a)&&(b=a.slice().reverse()),b}}).filter("display_tweet",function(){return function(a){return a&&a.length>100&&(a=a.slice(0,97)+"..."),a}}).filter("thumb",function(){return function(a){if(a){var b=a.split(","),c="http://covers.openlibrary.org/b/isbn/"+b[0]+"-L.jpg";return c}}}).filter("medium_thumb",function(){return function(a){var b="";if(a){var c=a.split(",");return angular.forEach(c,function(a){b="http://covers.openlibrary.org/b/isbn/"+a+"-M.jpg"}),b}}}).filter("small_thumb",function(){return function(a){var b="";if(a){var c=a.split(",");return angular.forEach(c,function(a){var c=new Image;c.src="http://covers.openlibrary.org/b/isbn/"+a+"-S.jpg",c.height>20&&""==b&&(b=c.src)}),b}}}).filter("thumb_backup",function(){return function(a){var b=a;return(angular.isUndefined(a)||""==a||null==a)&&(b="assets/profile_pic.jpeg"),b}}).filter("blob_backup",function(){return function(a){var b=a.thumb;return(angular.isUndefined(b)||""==b||null==b)&&(b=a.thumb_blob,angular.isUndefined(b)&&(b="assets/profile_pic.jpeg")),b}}).filter("is_present",function(){return function(a){var b=!1;return a&&""!=a&&(b=!0),b}});;var appConstants=angular.module("appConstants",[]),emotions=[{name:"nostalgic",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"enlightened",icon:"icon-smiley",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"insane",icon:"icon-grin2",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"happy",icon:"icon-happy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"sad",icon:"icon-sad",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"frustrated",icon:"icon-angry",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"bored",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"scared",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"funny",icon:"icon-tongue",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"confused",icon:"icon-confused",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"romantic",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"inspired",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"out of the world",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"alone",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"loved",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"upset",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"awesome",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"sleepy",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"crazy",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"heartbroken",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"irritated",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"wonderful",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"blessed",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"lonely",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"bored",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"incomplete",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"hopeful",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"hurt",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"great",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"high",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"pumped",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"drained",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"old",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"naughty",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"guilty",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"low",icon:"",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"excited",icon:"icon-wink",value:[{SearchBook:!0}],icon2:"icon-book"}],constants={IntroConstants:{NewsFeed:"Keep track of what your friends are doing on Reader's Door.",Shelves:"Create virtual book shelves.",Trending:"Check out books related to trending topics in media",Listopia:"Check out lists from your friends",Friends:"Check out your friend list",Share:"Share your book reading memories, insights, feelings and emotions...",Profile:"Edit your profile",RecommendationTab:"Recommendations Tab",MyLibraryTab:"My Library Tab",BooksReadTab:"Books Read Tab",ShelvesTab:"Shelves Tab",Scroller:"Try these scrollers"},LoginConstants:{EmailNotPresent:"Enter your email address",PasswordNotPresent:"Enter your password",PasswordLengthError:"Minimum password length is 8",ChooseAMoreSecurePassword:"Choose a more secure password",MaximumPasswordLengthError:"Maximum password length is 100",FacebookLoginStatusCheck:"connected"},RecommendationUIConstants:{TickerPopupMaxHeight:"54vh",FriendsGridMaxHeight:"54vh",FriendsGridMinHeight:"30vh",NotificationsMinHeight:"30vh",NotificationsMaxHeight:"54vh",BookmarkPanel:"BOOKMARK",BookTab:"BOOK",AuthorTab:"AUTHOR",ReaderTab:"READER",ZeroBooksFound:"ALERT- Reset the filters couldn't find more books.",MarkAsRead:"I HAVE READ",InfluentialBooks:"INFLUENTIAL BOOKS"},SearchUIConstants:{BookLabel:"Book",AuthorLabel:"Author",ReaderLabel:"User",TypeMore:"Type more characters...",ComingSoon:"Coming Soon...",NoResultsFound:"No results found...",BookSearch:"BOOK",BookSearchPlaceholder:"Search books...",SearchingBooks:"Searching books...",AuthorSearch:"AUTHOR",AuthorSearchPlaceholder:"Search authors...",AuthorPlaceholder:"Search and add an author to filters...",SearchingAuthors:"Searching authors...",ReaderSearch:"READER",ReaderSearchPlaceholder:"Search readers...",SearchingReaders:"Searching readers...",SearchingGenres:"Searching genres...",SearchingAuthors:"Searching authors...",SearchingUsers:"Searching users...",Year:"YEAR",YearPlaceholder:"Search and add a published year to filters...",List:"LIST",ListPlaceholder:"by list...",Country:"COUNTRY",CountryPlaceholder:"Search and add a country to filters...",Genre:"GENRE",GenrePlaceholder:"Search and add a genre to filters...",Time:"TIME",TimePlaceholder:"Search and add a reading time to filters...",Gender:"GENDER",GenderPlaceholder:"by gender...",MaleGender:"Male",FemaleGender:"Female",DontCareGender:"I don't care",Awards:"AWARDS",AwardsPlaceholder:"by awards...",LevelTwoPlaceHolder:"Select a category",BookSearchLink:"Book",AuthorSearchLink:"Author",ReaderSearchLink:"Reader",SearchPlaceholder:"Search for a book, author, or a reader...",BookByYearLink:"Find books by era",BookByReadingTimeLink:"Find books by reading time",BookByRegionLink:"Find books by region",BookByGenreLink:"Find books by genre",BookListsLink:"Get popular lists of books",BookByAuthorLink:"Find books by author",AuthorByYearLink:"Find authors by era",AuthorByRegionLink:"Find authors by region",AuthorByAwardsLink:"Find authors by awards",AuthorsByGenreLink:"Find authors by genre",AuthorListsLink:"Get popular lists of authors",ReaderByRegionLink:"Find readers by region",ReaderByTasteLink:"Find readers by their taste",ReaderByGenderLink:"Find readers by gender",ReaderListsLink:"Get popular lists of readers",SearchingWebsite:"Searching reader's door...",SearchAll:"ALL",Hash:"#",Plus:"+",AtTheRate:"@",SearchingAuthorsAndReaders:"Searching authors and readers...",SearchingTags:"Searching books categories...",TagSearch:"TAG"},WebsiteUIConstants:{Share:"Share your book reading journey...",BrowserIncompatible:"Please use latest version of Chrome for now...",Enter:13,Backspace:8,KeyUp:38,KeyDown:40,KeyLeft:37,KeyRight:39,Delete:46,Escape:27,StatusPosted:"Shared",ShareSomething:"Share something...",CoverPhotoCDN:"http://rd-images.readersdoor.netdna-cdn.com/cp/"},ColorConstants:{value:["#695447","#d1d2de","#c4c2b5","#675850","#83817f","#b3b2b1","#839baa","#4867a4","#423b34","#e4bc7e","#987c4e","#8c7971","#ad9894","#565240","#5d2726"]},StatusUIConstants:{EmotionConstants:{icon:"icon-happy",name:"Emotion",value:[{name:"Feeling",icon:"icon-neutral",label:"Feeling",value:emotions,icon2:"icon-book"},{name:"Thinking about",icon:"",label:"Thinking",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Smelling pages of",icon:"",label:"Smelling",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Counting pages of",icon:"",label:"Counting",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Reading",icon:"",label:"Reading",icon2:"icon-book",value:[{SearchBook:!0},{name:"on mountains",icon:"",value:[{SearchBook:!0}]},{name:"on bed",icon:"",value:[{SearchBook:!0}]},{name:"on train",icon:"",value:[{SearchBook:!0}]}]}]},OwnershipConstants:{icon:"icon-feed",name:"Shout",value:[{name:"Looking to buy",icon:"",value:[{SearchBook:!0}]},{name:"Looking to borrow",icon:"",value:[{SearchBook:!0}]},{name:"Looking to give",icon:"",value:[{SearchBook:!0}]},{name:"Looking to read",icon:"",value:[{SearchBook:!0}]},{name:"Gifted",icon:"",value:[{SearchBook:!0}]}]},QuoteConstants:{icon:"icon-quote-right",name:"Quote"}}};angular.forEach(constants,function(a,b){appConstants.constant(b,a)});