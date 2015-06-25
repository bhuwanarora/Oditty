function setCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+"; "+e+"; path=/"}function getCookie(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}function deleteCookie(a){setCookie(a,"",-1)}var homeApp=angular.module("homeApp",["ngAnimate","ngMaterial","ngMessages","duScroll","ngRoute","monospaced.mousewheel","appConstants","timer","duScroll","filtersApp","angular.filter","angular-parallax","ngSanitize","ngCookies","facebook"]);homeApp.config(["$routeProvider",function(a){a.when("/discover",{templateUrl:"assets/angular/views/landing_page/discover.html"}).otherwise({templateUrl:"assets/angular/views/landing_page/main.html"})}]),homeApp.config(["$mdThemingProvider",function(a){a.definePalette("googleBlue",{50:"4487FF",100:"4485FA",200:"4182F5",300:"427fed",400:"3D7BEA",500:"3066C7",600:"3066C7",700:"3066C7",800:"3066C7",900:"3066C7",A100:"3066C7",A200:"3066C7",A400:"3066C7",A700:"3066C7",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleRed",{50:"F4473B",100:"EF4539",200:"ED4539",300:"E84236",400:"DF4034",500:"D03C31",600:"C73A30",700:"C73A30",800:"C73A30",900:"C73A30",A100:"C73A30",A200:"C73A30",A400:"C73A30",A700:"C73A30",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleGreen",{50:"03A35D",100:"029655",200:"039052",300:"02884D",400:"03844C",500:"009C58",600:"027C47",700:"027C47",800:"027C47",900:"027C47",A100:"027C47",A200:"027C47",A400:"027C47",A700:"027C47",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.theme("default").primaryPalette("blue").accentPalette("googleGreen").warnPalette("googleRed")}]),homeApp.constant("facebookAppId","667868653261167"),homeApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]),homeApp.run(["$rootScope","$location","$cookieStore","$cookies","$http",function(a,b,c,d,e){var f=""==getCookie("logged");if(f){var g=b.$$absUrl.indexOf("signup")<0&&b.$$absUrl.indexOf("book")<0&&b.$$absUrl.indexOf("author")<0&&b.$$absUrl.indexOf("communities")<0&&b.$$absUrl.indexOf("home")<0&&b.$$absUrl.indexOf("room")<0&&b.$$absUrl.indexOf("news")<0&&b.$$absUrl.indexOf("news_group")<0&&b.$$absUrl.indexOf("filters")<0&&b.$$absUrl.indexOf("publisher")<0&&b.$$absUrl.indexOf("search")<0&&b.$$absUrl.indexOf("profile")<0;g&&(setCookie("redirect_url",b.$$absUrl),window.location.href="/signup")}}]);var _deferred_request=function(a,b,c,d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert("Something went wrong. If you're already Logged in. Try Logging out and Log in again.")};return angular.isDefined(d)?c.get(d+a,{withCredentials:!0}).then(f,g):c.get(a).then(f,g),e.promise},_deferred_post_request=function(a,b,c,d){var e=c.defer(),f=function(a){return e.resolve(a.data)},g=function(a){if(500==a.status)alert("Something went wrong. Our developers are working on this error.");else if(403==a.status)return e.reject(a)};return d.post(a,b).then(f,g),e.promise};;angular.module("filtersApp",[]).filter("integer",function(){return function(a){var b=a;return angular.isDefined(a)&&null!=a?a>=1e6?b=(a/1e6).toFixed(0)+"m":a>=1e3&&(b=(a/1e3).toFixed(0)+"k"):b=0,b}}).filter("random_color",["ColorConstants",function(a){return function(){var b=Math.floor(Math.random()*a.value.length),c=a.value[b];return c}}]).filter("first_isbn",function(){return function(a){var b="";return angular.isDefined(a)&&(isbn=a.split(","),b=isbn[0]),b}}).filter("search_item_type",function(){return function(a){var b="";if(angular.isDefined(a)){var c="Book"==a.labels||a.labels.indexOf("Book")>=0,d="Author"==a.labels||a.labels.indexOf("Author")>=0,e="User"==a.labels,f="Blog"==a.labels,g="News"==a.labels,h="Community"==a.labels;c?b="Book":d?b="Author":f?b="Blog":e?b="User":g?b="News":h&&(b="Room")}return b}}).filter("default_profile",function(){return function(a){var b=a;return(angular.isUndefined(a)||""==a||null==a)&&(b="/assets/user_profile.jpg"),b}}).filter("first_two",function(){return function(a){return angular.isDefined(a)&&(a=a.slice(0,2)),a}}).filter("flipkart_title",function(){return function(a){var b=a.replace(/the/gi,"").replace(/with/gi,"").toLowerCase();return b=b.replace(/ /gi,"-")}}).filter("category_group",function(){return function(a,b){output=[];var c=function(a){var c=!1;return a.root_category.length>0&&angular.forEach(a.root_category,function(a){a.name==b.name&&(c=!0)}),c};return angular.forEach(a,function(a){c(a)&&this.push(a)},output),output}}).filter("trending_name",function(){return function(a){return angular.isDefined(a)&&(a="#"+a.replace(" ","")),a}}).filter("reduced_label",function(){return function(a){return angular.isDefined(a)&&a.length>20&&(a=a.slice(0,20)+"..."),a}}).filter("first_name",function(){return function(a){return angular.isDefined(a)&&(a=a.split(" ")[0]),a}}).filter("reduced_title",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>28&&(a=a.slice(0,25)+"..."),a}}).filter("reduced_news_title",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>53&&(a=a.slice(0,50)+"..."),a}}).filter("reduced_summary",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>303&&(a=a.slice(0,300)+"..."),a}}).filter("compressed_filter",function(){return function(a){return angular.isDefined(a)&&null!=a&&a.length>7&&(a=a.slice(0,7)+".."),a}}).filter("author_thumb",function(){return function(a){var b="";return angular.isDefined(a)&&a&&(b="http://rd-authors.readersdoor.netdna-cdn.com/"+a+"/M.png"),b}}).filter("author_small_thumb",function(){return function(a){var b="";return angular.isDefined(a)&&a&&(b="http://rd-authors.readersdoor.netdna-cdn.com/"+a+"/T.png"),b}}).filter("choose_medium_thumb",function(){return function(a){var b="";if(angular.isDefined(a)&&a){var c=angular.isDefined(a.external_thumb)&&null!=a.external_thumb;if(c)b=a.external_thumb;else if(a.isbn){var d=a.isbn.split(",");b="http://rd-images.readersdoor.netdna-cdn.com/"+d[0]+"/M.jpg"}}return b}}).filter("summary",function(){return function(a){var b=a;return angular.isDefined(a)&&""!=a&&null!=a&&(b="<span><b>"+a[0]+"</b></span><span class='light_grey_color'>"+a.substring(1,80)+"</span><span>"+a.substring(80,a.length)+"</span>"),b}}).filter("header_title",function(){return function(a){return output=a,(angular.isUndefined(a)||""==a)&&(output="Recommendations"),output}}).filter("heading",function(){return function(a){var b=a;if(angular.isDefined(a)){a.length>40&&(a=a.slice(0,37)+"..."),a=a.split(" "),b="<span>&nbsp;</span>";for(var c=0;c<a.length;c++){var d=a[c];b=b+"<span><b>"+d[0]+"</b><span>"+d.substring(1,d.length)+"</span> "}}return b}}).filter("rating",function(){return function(a){if(angular.isDefined(a))var b=a.toFixed(1);return b}}).filter("book_title",function(){return function(a){return angular.isDefined(a)&&a.length>50&&(a=a.slice(0,47)+"..."),a}}).filter("book_tag",function(){return function(a){return angular.isDefined(a)&&a.length>28&&(a=a.slice(0,25)+"..."),a}}).filter("published_year",function(){return function(a){var b=a.split(" "),a=b[b.length-1];a=parseInt(a);var c=a>658&&1100>a,d=a>1100&&1500>a,e=a>1500&&1660>a,f=a>1660&&1798>a,g=a>1798&&1837>a,h=a>1837&&1901>a,i=a>1901&&1939>a,j=a>1939&&2e3>a,k=a>2e3&&2014>a;return c?output="Old English Literature":d?output="Middle English Literature":e?output="English Renaissance":f?output="Neo Classical Period":g?output="Romanticism":h?output="Victorian Literature":i?output="Modernism":j?output="Post Modern Literature":k?output="20th Century Literature":output="Invalid",output}}).filter("page_count",function(){return function(a){var b="-"+a+" pages";return(angular.isUndefined(a)||0==a)&&(b=""),b}}).filter("message",function(){return function(a){return a.length>55,a}}).filter("reverse",function(){return function(a){var b=a;return angular.isDefined(a)&&(b=a.slice().reverse()),b}}).filter("display_tweet",function(){return function(a){return a&&a.length>100&&(a=a.slice(0,97)+"..."),a}}).filter("large_thumb",function(){return function(a){var b="";if(angular.isDefined(a)&&a){var c=angular.isDefined(a.external_thumb)&&null!=a.external_thumb;if(c)b=a.external_thumb;else if(a.isbn){var d=a.isbn.split(",");b="http://rd-images.readersdoor.netdna-cdn.com/"+d[0]+"/L.jpg"}}return b}}).filter("medium_thumb",function(){return function(a){var b="";if(a){var c=a.split(",");return angular.forEach(c,function(a){b="http://rd-images.readersdoor.netdna-cdn.com/"+a+"/M.jpg"}),b}}}).filter("small_thumb",function(){return function(a){var b="";if(a){var c=a.split(",");return angular.forEach(c,function(a){var c=new Image;c.src="http://rd-images.readersdoor.netdna-cdn.com/"+a+"/S.jpg",b=c.src,c.height>20&&""==b}),b}}}).filter("cdn_image",function(){return function(a,b){var c="";return a&&(c="http://rd-images.readersdoor.netdna-cdn.com/"+a+"/"+b+".png"),c}}).filter("thumb_backup",function(){return function(a){var b=a;return(angular.isUndefined(a)||""==a||null==a)&&(b="assets/profile_pic.jpeg"),b}}).filter("blob_backup",function(){return function(a){var b=a.thumb;return(angular.isUndefined(b)||""==b||null==b)&&(b=a.thumb_blob,angular.isUndefined(b)&&(b="assets/profile_pic.jpeg")),b}}).filter("html",function(a){return function(b){return a.trustAsHtml(b)}}).filter("is_present",function(){return function(a){var b=!1;return a&&""!=a&&(b=!0),b}}).filter("timestamp",function(){return function(a){var b=new Date(0);return b.setUTCSeconds(a)}}).filter("initial",function(){return function(a){try{var b=a.name.charAt(0)}catch(c){var b="X"}return b}}).filter("web_header",function(){return function(a){if(angular.isDefined(a.name))if(a=a.name.split(" ")[0],angular.isDefined(a)||""==a)for(var b="",c=0;c<a.length;c++){var d=a.charAt(c);b=b+"<span>"+d+"</span>"}else var b="<span>r</span><span>e</span><span>a</span><span>d</span><span>e</span><span>r</span><span>'</span><span>s</span>";else var b="<span>r</span><span>e</span><span>a</span><span>d</span><span>e</span><span>r</span><span>'</span><span>s</span>";return b+="<span>&nbsp;</span><span>d</span><span>o</span><span>o</span><span>r</span>"}});;homeApp.value("base_url","http://readersdoor.com"),homeApp.value("search_service_url","http://109.237.26.43"),homeApp.value("google_public_key","AIzaSyAV495wghmWMcTENY9CsrUpvVPzJpNOaxo");;var appConstants=angular.module("appConstants",[]),emotions=[{name:"nostalgic",icon:"i-nostalgic",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"enlightened",icon:"i-enlightened",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"insane",icon:"i-insane",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"happy",icon:"i-happy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"sad",icon:"i-sad",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"frustrated",icon:"i-frustrated",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"bored",icon:"i-bored",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"scared",icon:"i-scared",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"funny",icon:"i-funny",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"confused",icon:"i-confused",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"romantic",icon:"i-romantic",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"inspired",icon:"i-inspired",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"out of the world",icon:"i-out-of-the-world",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"alone",icon:"i-alone",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"loved",icon:"i-loved",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"upset",icon:"i-upset",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"awesome",icon:"i-awesome",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"sleepy",icon:"i-sleepy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"crazy",icon:"i-crazy",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"heartbroken",icon:"i-heartbroken",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"irritated",icon:"i-irritated",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"wonderful",icon:"i-wonderful",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"blessed",icon:"i-blessed",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"lonely",icon:"i-lonely",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"incomplete",icon:"i-incomplete",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"hopeful",icon:"i-hopeful",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"hurt",icon:"i-hurt",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"great",icon:"i-great",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"high",icon:"i-high",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"pumped",icon:"i-pumped",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"drained",icon:"i-drained",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"old",icon:"i-old",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"naughty",icon:"i-naughty",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"guilty",icon:"i-guilty",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"low",icon:"i-low",value:[{SearchBook:!0}],icon2:"icon-book",link:"while reading"},{name:"excited",icon:"i-excited",value:[{SearchBook:!0}],icon2:"icon-book"}],places=[],constants={Emotions:emotions,IntroConstants:{NewsFeed:"<div class='tooltip_header'><div class='larger_font inline_block icon-newspaper site_color'></div><div class='inline_block header_text'>Keep track of what your friends are doing on ReadersDoor.</div></div>",Shelves:"<div class='tooltip_header'><div class='larger_font inline_block icon-bookmark2 yellow_color'></div><div class='inline_block header_text'>Create virtual book shelves.</div></div>",Trending:"<div class='tooltip_header'><div class='larger_font inline_block icon-bars red_color'></div><div class='inline_block header_text'>Check out books related to trending topics in media.</div></div>",Listopia:"<div class='tooltip_header'><div class='larger_font inline_block icon-list purple_color'></div><div class='inline_block header_text'>Check out customised lists of books from different magazines.</div></div>",Friends:"<div class='tooltip_header'><div class='larger_font inline_block icon-users green_color'></div><div class='inline_block header_text'>Explore your friends profile.</div></div>",Share:"<div class='tooltip_header'>Share your book reading memories, insights, feelings and emotions...</div>",Profile:"<div class='tooltip_header'>Edit your profile</div>",RecommendationTab:"<div class='tooltip_header'>Recommendations Tab</div>",MyLibraryTab:"<div class='tooltip_header'>My Library Tab</div>",BooksReadTab:"<div class='tooltip_header'>Books Read Tab</div>",ShelvesTab:"<div class='tooltip_header'>Your personalised recommendations and library of books.</div>",Scroller:"<div class='tooltip_header'>Try these scrollers</div>"},LoginConstants:{EmailNotPresent:"Enter your email address",PasswordNotPresent:"Enter your password",PasswordLengthError:"Minimum password length is 8",ChooseAMoreSecurePassword:"Choose a more secure password",MaximumPasswordLengthError:"Maximum password length is 100",FacebookLoginStatusCheck:"connected",Description:["<b>Connecting information</b> in news and media with books...","Creating <b>virtual shelves</b> of books...","Setting <b>fitlers</b> on books...","Capturing book reading journeys...","Working on your <b>personalised book recommendations</b>...","Building <b>Listopia</b> of books...","Get set Login..."]},RecommendationUIConstants:{TickerPopupMaxHeight:"54vh",FriendsGridMaxHeight:"54vh",FriendsGridMinHeight:"30vh",NotificationsMinHeight:"30vh",NotificationsMaxHeight:"54vh",BookmarkPanel:"BOOKMARK",BookTab:"BOOK",AuthorTab:"AUTHOR",ReaderTab:"READER",ZeroBooksFound:"ALERT- Reset the filters couldn't find more books.",MarkAsRead:"I HAVE READ",InfluentialBooks:"INFLUENTIAL BOOKS",FetchingData:"Fetching data from your apps on facebook...",FetchingError:"Error in fetching data from the database...",DatabaseConnect:"Connecting to ReadersDoor database...",BooksFound:"Please choose the right book for the title you've read..."},SearchUIConstants:{BookLabel:"Book",AuthorLabel:"Author",ReaderLabel:"User",TypeMore:"Type more characters...",ComingSoon:"Coming soon with exhaustive filters...",NoResultsFound:"No results found...",BookSearch:"BOOK",TextSearch:"TEXT",BookSearchPlaceholder:"Search books...",SearchingBooks:"Searching books...",AuthorSearch:"AUTHOR",AuthorSearchPlaceholder:"Search authors...",AuthorPlaceholder:"Search and add an author to filters...",SearchingAuthors:"Searching authors...",ReaderSearch:"READER",ReaderSearchPlaceholder:"Search readers...",SearchingReaders:"Searching readers...",SearchingGenres:"Searching genres...",SearchingAuthors:"Searching authors...",SearchingUsers:"Searching users...",Year:"YEAR",YearPlaceholder:"Search and add a published year to filters...",List:"LIST",ListPlaceholder:"by list...",Country:"COUNTRY",CountryPlaceholder:"Search and add a country to filters...",Genre:"GENRE",GenrePlaceholder:"Search and add a genre to filters...",Time:"TIME",TimePlaceholder:"Search and add a reading time to filters...",Gender:"GENDER",GenderPlaceholder:"by gender...",MaleGender:"Male",FemaleGender:"Female",DontCareGender:"I don't care",Awards:"AWARDS",AwardsPlaceholder:"by awards...",LevelTwoPlaceHolder:"Select a category",BookSearchLink:"Book",AuthorSearchLink:"Author",ReaderSearchLink:"Reader",SearchPlaceholder:"Add filters or start searching books and authors...",BookByYearLink:"Find books by era",BookByReadingTimeLink:"Find books by reading time",BookByRegionLink:"Find books by region",BookByGenreLink:"Find books by genre",BookListsLink:"Get popular lists of books",BookByAuthorLink:"Find books by author",AuthorByYearLink:"Find authors by era",AuthorByRegionLink:"Find authors by region",AuthorByAwardsLink:"Find authors by awards",AuthorsByGenreLink:"Find authors by genre",AuthorListsLink:"Get popular lists of authors",ReaderByRegionLink:"Find readers by region",ReaderByTasteLink:"Find readers by their taste",ReaderByGenderLink:"Find readers by gender",ReaderListsLink:"Get popular lists of readers",SearchingWebsite:"Searching ReadersDoor...",SearchAll:"ALL",Hash:"#",Plus:"+",AtTheRate:"@",SearchingAuthorsAndReaders:"Searching authors and readers...",SearchingTags:"Searching books categories...",TagSearch:"TAG"},WebsiteUIConstants:{LeftPanelMinWidth:"16%",ServerError:"Something went wrong. Our developers are working on this error.",Share:"Share your book reading journey...",BrowserIncompatible:"Please use latest version of Chrome for now...",Enter:13,Backspace:8,KeyUp:38,KeyDown:40,KeyLeft:37,KeyRight:39,Delete:46,Escape:27,LeftShift:16,RightShift:51,LeftCommand:91,RightCommand:93,StatusPosted:"Shared",CoverPhotoCDN:"http://rd-images.readersdoor.netdna-cdn.com/cp/",GenreAWS:"https://s3-ap-southeast-1.amazonaws.com/rd-genres/"},ColorConstants:{value:["#26c6da","#00acc1","#0097a7","#00838f","#006064"]},ShareOptions:{ReadingStage:[{name:"Planning to read",nested_options:[{name:"Looking to buy",search_book:!0},{name:"Looking to borrow",search_book:!0}]},{name:"Reading",nested_options:[{name:"Feeling",value:emotions}]},{name:"Finished reading",nested_options:[{name:"Feeling",value:emotions}]}]},StatusUIConstants:{EmotionConstants:{icon:"icon-happy",name:"Emotion",value:[{name:"Currently reading",icon:"i-reading",label:"Reading",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Feeling",icon:"i-feeling",label:"Feeling",value:emotions,icon2:"icon-book"},{name:"Thinking about",icon:"i-thinking",label:"Thinking",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Smelling pages of",icon:"i-smelling",label:"Smelling",icon2:"icon-book",value:[{SearchBook:!0}]},{name:"Counting pages of",icon:"i-counting",label:"Counting",icon2:"icon-book",value:[{SearchBook:!0}]}]},OwnershipConstants:{icon:"icon-feed",name:"Shout",value:[{name:"Looking to buy",icon:"",value:[{SearchBook:!0}]},{name:"Looking to borrow",icon:"",value:[{SearchBook:!0}]},{name:"Willing to lend",icon:"",value:[{SearchBook:!0}]}]},QuoteConstants:{icon:"icon-quote-right",name:"Quote"}}};angular.forEach(constants,function(a,b){appConstants.constant(b,a)});