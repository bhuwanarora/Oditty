function notify(a,b,c){var d=b.split("-"),e=d[0];"SUCCESS"==e?(a.message_type=0,a.message_style={"background-color":"#f9edbe"}):"ALERT"==e?(a.message_type=1,a.message_style={"background-color":"#d73d32"}):(a.message_type=2,a.message_style={"background-color":"#427fed"}),a.message=d.slice(1,d.length).join("-"),a.notification_active=!0;var f=c(function(){a.notification_active=!1,a.message=""},7e3);return f}function get_size(){"number"==typeof window.innerWidth?(window_width=window.innerWidth,window_height=window.innerHeight):document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?(window_width=document.documentElement.clientWidth,window_height=document.documentElement.clientHeight):document.body&&(document.body.clientWidth||document.body.clientHeight)&&(window_width=document.body.clientWidth,window_height=document.body.clientHeight)}var websiteApp=angular.module("websiteApp",["ngRoute","ngAnimate","monospaced.mousewheel","facebook","ngMap","cropme","duScroll","filtersApp","ngCookies","ngTouch","angular-intro","appConstants"]);websiteApp.config(["$routeProvider","$locationProvider",function(a){a.when("/search",{templateUrl:"/assets/angular/views/search/show.html"}).when("/search/url/:url",{templateUrl:"/assets/angular/views/search/show.html"}).when("/user/:id",{templateUrl:"/assets/angular/views/search/show.html"}).when("/user/:id/recommendations/:type",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/recommendations/:type/filter/:filter_id/name/:name",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/recommendations/:type/label/:label_id/name/:name",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/grid/:type/id/:grid_id/name/:name",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/trending/:type/id/:trend_id/name/:name",{templateUrl:"/assets/angular/views/home.html"}).when("/book/:id",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/book/:title/author/:author",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/book/:title/all/:status",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/book/:book_id",{templateUrl:"/assets/angular/views/home.html"}).when("/user/:id/book/:title/author/:author/id/:book_id",{templateUrl:"/assets/angular/views/home.html"}).when("/reader/:id/:type",{templateUrl:"/assets/angular/views/home.html"}).when("/",{templateUrl:"/assets/angular/views/search/show.html"}).otherwise({templateUrl:"/assets/angular/views/search/show.html"})}]),websiteApp.constant("facebookAppId","667868653261167"),websiteApp.run(["$rootScope","$location","$cookieStore","$cookies","$http",function(a,b,c){a.$on("$routeChangeStart",function(d,e){var f=!a.user.logged&&!c.get("logged"),g=null!=b.url().match(/^\/book\//),h=null!=b.url().match(/^\/search\/url\//);if(f)g?b.path("/search/url/"+encodeURIComponent(b.url())):"/assets/angular/views/search/show.html"==e.templateUrl||b.path("/search");else if(h);else if(g){var i="/user/"+a.user.id+b.url();b.path(i)}})}]),angular.element(document).ready(function(){angular.bootstrap(document,["websiteApp"])}),websiteApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]);var window_width=0,window_height=0;get_size();;angular.module("filtersApp",[]).filter("integer",function(){return function(a){var b=a;return angular.isDefined(a)&&null!=a?a>=1e6?b=(a/1e6).toFixed(0)+"m":a>=1e3&&(b=(a/1e3).toFixed(0)+"k"):b=0,b}}).filter("trending_name",function(){return function(a){return angular.isDefined(a)&&(a="#"+a.replace(" ","")),a}}).filter("reduced_label",function(){return function(a){return angular.isDefined(a)&&a.length>20&&(a=a.slice(0,20)+"..."),a}}).filter("first_name",function(){return function(a){return angular.isDefined(a)&&(a=a.split(" ")[0]),a}}).filter("reduced_title",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>28&&(a=a.slice(0,25)+"..."),a}}).filter("reduced_summary",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>85&&(a=a.slice(0,80)+"..."),a}}).filter("compressed_filter",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>7&&(a=a.slice(0,7)+".."),a}}).filter("choose_medium_thumb",function(){return function(a){var b="";if(angular.isDefined(a)){var c=angular.isDefined(a.external_thumb)&&null!=a.external_thumb;if(c)b=a.external_thumb;else if(a.isbn){var d=a.isbn.split(",");b="http://covers.openlibrary.org/b/isbn/"+d[0]+"-M.jpg"}}return b}}).filter("summary",function(){return function(a){var b=a;return angular.isDefined(a)&&""!=a&&null!=a&&(b="<span><b>"+a[0]+"</b></span><span class='light_grey_color'>"+a.substring(1,80)+"</span><span>"+a.substring(80,a.length)+"</span>"),b}}).filter("header_title",function(){return function(a){return output=a,(angular.isUndefined(a)||""==a)&&(output="Recommendations"),output}}).filter("heading",function(){return function(a){var b=a;if(angular.isDefined(a)){a.length>40&&(a=a.slice(0,37)+"..."),a=a.split(" "),b="<span>&nbsp;</span>";for(var c=0;c<a.length;c++){var d=a[c];b=b+"<span><b>"+d[0]+"</b><span>"+d.substring(1,d.length)+"</span> "}}return b}}).filter("rating",function(){return function(a){if(angular.isDefined(a))var b=a.toFixed(1);return b}}).filter("book_title",function(){return function(a){return angular.isDefined(a)&&a.length>50&&(a=a.slice(0,47)+"..."),a}}).filter("book_tag",function(){return function(a){return angular.isDefined(a)&&a.length>28&&(a=a.slice(0,25)+"..."),a}}).filter("published_year",function(){return function(a){var b=a.split(" "),a=b[b.length-1];a=parseInt(a);var c=a>658&&1100>a,d=a>1100&&1500>a,e=a>1500&&1660>a,f=a>1660&&1798>a,g=a>1798&&1837>a,h=a>1837&&1901>a,i=a>1901&&1939>a,j=a>1939&&2e3>a,k=a>2e3&&2014>a;return output=c?"Old English Literature":d?"Middle English Literature":e?"English Renaissance":f?"Neo Classical Period":g?"Romanticism":h?"Victorian Literature":i?"Modernism":j?"Post Modern Literature":k?"20th Century Literature":"Invalid"}}).filter("page_count",function(){return function(a){var b="-"+a+" pages";return(angular.isUndefined(a)||0==a)&&(b=""),b}}).filter("message",function(){return function(a){return a.length>55,a}}).filter("reverse",function(){return function(a){var b=a;return angular.isDefined(a)&&(b=a.slice().reverse()),b}}).filter("display_tweet",function(){return function(a){return a&&a.length>100&&(a=a.slice(0,97)+"..."),a}}).filter("thumb",function(){return function(a){if(a){var b=a.split(","),c="http://covers.openlibrary.org/b/isbn/"+b[0]+"-L.jpg";return c}}}).filter("medium_thumb",function(){return function(a){var b="";if(a){var c=a.split(",");return angular.forEach(c,function(a){b="http://covers.openlibrary.org/b/isbn/"+a+"-M.jpg"}),b}}}).filter("small_thumb",function(){return function(a){var b="";if(a){var c=a.split(",");return angular.forEach(c,function(a){var c=new Image;c.src="http://covers.openlibrary.org/b/isbn/"+a+"-S.jpg",c.height>20&&""==b&&(b=c.src)}),b}}}).filter("thumb_backup",function(){return function(a){var b=a;return(angular.isUndefined(a)||""==a||null==a)&&(b="assets/profile_pic.jpeg"),b}}).filter("blob_backup",function(){return function(a){var b=a.thumb;return(angular.isUndefined(b)||""==b||null==b)&&(b=a.thumb_blob,angular.isUndefined(b)&&(b="assets/profile_pic.jpeg")),b}}).filter("html",function(a){return function(b){return a.trustAsHtml(b)}}).filter("is_present",function(){return function(a){var b=!1;return a&&""!=a&&(b=!0),b}}).filter("timestamp",function(){return function(a){var b=new Date(0);return b.setUTCSeconds(a)}});;var appConstants=angular.module("appConstants",[]),emotions=[{name:"nostalgic",icon:"i-nostalgic",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"enlightened",icon:"i-enlightened",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"insane",icon:"i-insane",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"happy",icon:"i-happy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"sad",icon:"i-sad",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"frustrated",icon:"i-frustrated",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"bored",icon:"i-bored",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"scared",icon:"i-scared",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"funny",icon:"i-funny",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"confused",icon:"i-confused",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"romantic",icon:"i-romantic",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"inspired",icon:"i-inspired",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"out of the world",icon:"i-out-of-the-world",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"alone",icon:"i-alone",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"loved",icon:"i-loved",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"upset",icon:"i-upset",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"awesome",icon:"i-awesome",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"sleepy",icon:"i-sleepy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"crazy",icon:"i-crazy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"heartbroken",icon:"i-heartbroken",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"irritated",icon:"i-irritated",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"wonderful",icon:"i-wonderful",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"blessed",icon:"i-blessed",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"lonely",icon:"i-lonely",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"incomplete",icon:"i-incomplete",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"hopeful",icon:"i-hopeful",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"hurt",icon:"i-hurt",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"great",icon:"i-great",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"high",icon:"i-high",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"pumped",icon:"i-pumped",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"drained",icon:"i-drained",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"old",icon:"i-old",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"naughty",icon:"i-naughty",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"guilty",icon:"i-guilty",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"low",icon:"i-low",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"excited",icon:"i-excited",value:[{SearchBook:!0}],icon2:"icon-book"}],constants={IntroConstants:{NewsFeed:"<div class='tooltip_header'><div class='larger_font inline_block icon-newspaper site_color'></div><div class='inline_block header_text'>Keep track of what your friends are doing on Reader's Door.</div></div>",Shelves:"<div class='tooltip_header'><div class='larger_font inline_block icon-bookmark2 yellow_color'></div><div class='inline_block header_text'>Create virtual book shelves.</div></div>",Trending:"<div class='tooltip_header'><div class='larger_font inline_block icon-bars red_color'></div><div class='inline_block header_text'>Check out books related to trending topics in media.</div></div>",Listopia:"<div class='tooltip_header'><div class='larger_font inline_block icon-list purple_color'></div><div class='inline_block header_text'>Check out customised lists of books from different magazines.</div></div>",Friends:"<div class='tooltip_header'><div class='larger_font inline_block icon-users green_color'></div><div class='inline_block header_text'>Explore your friends profile.</div></div>",Share:"<div class='tooltip_header'>Share your book reading memories, insights, feelings and emotions...</div>",Profile:"<div class='tooltip_header'>Edit your profile</div>",RecommendationTab:"<div class='tooltip_header'>Recommendations Tab</div>",MyLibraryTab:"<div class='tooltip_header'>My Library Tab</div>",BooksReadTab:"<div class='tooltip_header'>Books Read Tab</div>",ShelvesTab:"<div class='tooltip_header'>Your personalised recommendations and library of books.</div>",Scroller:"<div class='tooltip_header'>Try these scrollers</div>"},LoginConstants:{EmailNotPresent:"Enter your email address",PasswordNotPresent:"Enter your password",PasswordLengthError:"Minimum password length is 8",ChooseAMoreSecurePassword:"Choose a more secure password",MaximumPasswordLengthError:"Maximum password length is 100",FacebookLoginStatusCheck:"connected"},RecommendationUIConstants:{TickerPopupMaxHeight:"54vh",FriendsGridMaxHeight:"54vh",FriendsGridMinHeight:"30vh",NotificationsMinHeight:"30vh",NotificationsMaxHeight:"54vh",BookmarkPanel:"BOOKMARK",BookTab:"BOOK",AuthorTab:"AUTHOR",ReaderTab:"READER",ZeroBooksFound:"ALERT- Reset the filters couldn't find more books.",MarkAsRead:"I HAVE READ",InfluentialBooks:"INFLUENTIAL BOOKS"},SearchUIConstants:{BookLabel:"Book",AuthorLabel:"Author",ReaderLabel:"User",TypeMore:"Type more characters...",ComingSoon:"Coming soon with exhaustive filters...",NoResultsFound:"No results found...",BookSearch:"BOOK",TextSearch:"TEXT",BookSearchPlaceholder:"Search books...",SearchingBooks:"Searching books...",AuthorSearch:"AUTHOR",AuthorSearchPlaceholder:"Search authors...",AuthorPlaceholder:"Search and add an author to filters...",SearchingAuthors:"Searching authors...",ReaderSearch:"READER",ReaderSearchPlaceholder:"Search readers...",SearchingReaders:"Searching readers...",SearchingGenres:"Searching genres...",SearchingAuthors:"Searching authors...",SearchingUsers:"Searching users...",Year:"YEAR",YearPlaceholder:"Search and add a published year to filters...",List:"LIST",ListPlaceholder:"by list...",Country:"COUNTRY",CountryPlaceholder:"Search and add a country to filters...",Genre:"GENRE",GenrePlaceholder:"Search and add a genre to filters...",Time:"TIME",TimePlaceholder:"Search and add a reading time to filters...",Gender:"GENDER",GenderPlaceholder:"by gender...",MaleGender:"Male",FemaleGender:"Female",DontCareGender:"I don't care",Awards:"AWARDS",AwardsPlaceholder:"by awards...",LevelTwoPlaceHolder:"Select a category",BookSearchLink:"Book",AuthorSearchLink:"Author",ReaderSearchLink:"Reader",SearchPlaceholder:"",BookByYearLink:"Find books by era",BookByReadingTimeLink:"Find books by reading time",BookByRegionLink:"Find books by region",BookByGenreLink:"Find books by genre",BookListsLink:"Get popular lists of books",BookByAuthorLink:"Find books by author",AuthorByYearLink:"Find authors by era",AuthorByRegionLink:"Find authors by region",AuthorByAwardsLink:"Find authors by awards",AuthorsByGenreLink:"Find authors by genre",AuthorListsLink:"Get popular lists of authors",ReaderByRegionLink:"Find readers by region",ReaderByTasteLink:"Find readers by their taste",ReaderByGenderLink:"Find readers by gender",ReaderListsLink:"Get popular lists of readers",SearchingWebsite:"Searching reader's door...",SearchAll:"ALL",Hash:"#",Plus:"+",AtTheRate:"@",SearchingAuthorsAndReaders:"Searching authors and readers...",SearchingTags:"Searching books categories...",TagSearch:"TAG"},WebsiteUIConstants:{ServerError:"Something went wrong. Please refresh the page and try again.",Share:"Share your book reading journey...",BrowserIncompatible:"Please use latest version of Chrome for now...",Enter:13,Backspace:8,KeyUp:38,KeyDown:40,KeyLeft:37,KeyRight:39,Delete:46,Escape:27,StatusPosted:"Shared",CoverPhotoCDN:"http://rd-images.readersdoor.netdna-cdn.com/cp/"},ColorConstants:{value:["#695447","#d1d2de","#c4c2b5","#675850","#83817f","#b3b2b1","#839baa","#4867a4","#423b34","#e4bc7e","#987c4e","#8c7971","#ad9894","#565240","#5d2726"]},StatusUIConstants:{EmotionConstants:{icon:"icon-happy",name:"Emotion",value:[{name:"Currently reading",icon:"i-reading",label:"Reading",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Feeling",icon:"i-feeling",label:"Feeling",value:emotions,icon2:"icon-book"},{name:"Thinking about",icon:"i-thinking",label:"Thinking",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Smelling pages of",icon:"i-smelling",label:"Smelling",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Counting pages of",icon:"i-counting",label:"Counting",icon2:"icon-book",value:[{SearchBook:!0}]}]},OwnershipConstants:{icon:"icon-feed",name:"Shout",value:[{name:"Looking to buy",icon:"",value:[{SearchBook:!0}]},{name:"Looking to borrow",icon:"",value:[{SearchBook:!0}]},{name:"Willing to lend",icon:"",value:[{SearchBook:!0}]}]},QuoteConstants:{icon:"icon-quote-right",name:"Quote"}}};angular.forEach(constants,function(a,b){appConstants.constant(b,a)});