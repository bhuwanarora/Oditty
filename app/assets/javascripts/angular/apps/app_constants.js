var appConstants = angular.module('appConstants', []);

var emotions = [
	{"name": "nostalgic", "icon": "i-nostalgic", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "enlightened", "icon": "i-enlightened", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "insane", "icon": "i-insane", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"}, 
	{"name": "happy", "icon": "i-happy", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "sad", "icon": "i-sad", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "frustrated", "icon": "i-frustrated", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "bored", "icon": "i-bored", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "scared", "icon": "i-scared", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "funny", "icon": "i-funny", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "confused", "icon": "i-confused","value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "romantic", "icon": "i-romantic", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "inspired", "icon": "i-inspired", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "out of the world", "icon": "i-out-of-the-world", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "alone", "icon": "i-alone", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "loved", "icon": "i-loved", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "upset", "icon": "i-upset", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "awesome", "icon": "i-awesome", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "sleepy", "icon": "i-sleepy", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "crazy", "icon": "i-crazy", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "heartbroken", "icon": "i-heartbroken", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "irritated", "icon": "i-irritated", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "wonderful", "icon": "i-wonderful", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "blessed", "icon": "i-blessed", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "lonely", "icon": "i-lonely", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "incomplete", "icon": "i-incomplete", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "hopeful", "icon": "i-hopeful", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "hurt", "icon": "i-hurt", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "great", "icon": "i-great", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "high", "icon": "i-high", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "pumped", "icon": "i-pumped", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "drained", "icon": "i-drained", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "old", "icon": "i-old", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "naughty", "icon": "i-naughty", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "guilty", "icon": "i-guilty", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "low", "icon": "i-low", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "excited", "icon": "i-excited","value": [{"SearchBook": true}], "icon2": "icon-book"}
]


var constants = {
		"IntroConstants":{
			"NewsFeed": "<div class='tooltip_header'><div class='larger_font inline_block icon-newspaper site_color'></div><div class='inline_block header_text'>Keep track of what your friends are doing on Reader's Door.</div></div>",

			"Shelves": "<div class='tooltip_header'><div class='larger_font inline_block icon-bookmark2 yellow_color'></div><div class='inline_block header_text'>Create virtual book shelves.</div></div>",

			"Trending": "<div class='tooltip_header'><div class='larger_font inline_block icon-bars red_color'></div><div class='inline_block header_text'>Check out books related to trending topics in media.</div></div>",

			"Listopia": "<div class='tooltip_header'><div class='larger_font inline_block icon-list purple_color'></div><div class='inline_block header_text'>Check out customised lists of books from different magazines.</div></div>",

			"Friends": "<div class='tooltip_header'><div class='larger_font inline_block icon-users green_color'></div><div class='inline_block header_text'>Explore your friends profile.</div></div>",

			"Share": "<div class='tooltip_header'>Share your book reading memories, insights, feelings and emotions...</div>",

			"Profile": "<div class='tooltip_header'>Edit your profile</div>",

			"RecommendationTab": "<div class='tooltip_header'>Recommendations Tab</div>",

			"MyLibraryTab": "<div class='tooltip_header'>My Library Tab</div>",

			"BooksReadTab": "<div class='tooltip_header'>Books Read Tab</div>",

			"ShelvesTab": "<div class='tooltip_header'>Your personalised recommendations and library of books.</div>",

			"Scroller": "<div class='tooltip_header'>Try these scrollers</div>"
		},
		"LoginConstants": {
			"EmailNotPresent": "Enter your email address",
			"PasswordNotPresent": "Enter your password",
			"PasswordLengthError": "Minimum password length is 8",
			"ChooseAMoreSecurePassword": "Choose a more secure password",
			"MaximumPasswordLengthError": "Maximum password length is 100",
			"FacebookLoginStatusCheck" :"connected"
		},
		"RecommendationUIConstants": {
			"TickerPopupMaxHeight": "54vh",
			"FriendsGridMaxHeight": "54vh",
			"FriendsGridMinHeight": "30vh",
			"NotificationsMinHeight": "30vh",
			"NotificationsMaxHeight": "54vh",
			"BookmarkPanel": 'BOOKMARK',
			"BookTab": "BOOK",
			"AuthorTab": "AUTHOR",
			"ReaderTab": "READER",
			"ZeroBooksFound": "ALERT- Reset the filters couldn't find more books.",
			"MarkAsRead": "I HAVE READ",
			"InfluentialBooks": "INFLUENTIAL BOOKS"
		},
		"SearchUIConstants": {
			"BookLabel": "Book",
			"AuthorLabel": "Author",
			"ReaderLabel": "User",
			"TypeMore": "Type more characters...",
			"ComingSoon": "Coming soon with exhaustive filters...",
			"NoResultsFound": "No results found...",
			"BookSearch": "BOOK",
			"TextSearch": "TEXT",
			"BookSearchPlaceholder": "Search books...",
			"SearchingBooks": "Searching books...",
			"AuthorSearch": "AUTHOR",
			"AuthorSearchPlaceholder": "Search authors...",
			"AuthorPlaceholder": "Search and add an author to filters...",
			"SearchingAuthors": "Searching authors...",
			"ReaderSearch": "READER",
			"ReaderSearchPlaceholder": "Search readers...",
			"SearchingReaders": "Searching readers...",
			"SearchingGenres": "Searching genres...",
			"SearchingAuthors": "Searching authors...",
			"SearchingUsers": "Searching users...",
			"Year": "YEAR",
			"YearPlaceholder": "Search and add a published year to filters...",
			"List": "LIST",
			"ListPlaceholder": "by list...",
			"Country": "COUNTRY",
			"CountryPlaceholder": "Search and add a country to filters...",
			"Genre": "GENRE",
			"GenrePlaceholder": "Search and add a genre to filters...",
			"Time" :"TIME",
			"TimePlaceholder": "Search and add a reading time to filters...",
			"Gender": "GENDER",
			"GenderPlaceholder": "by gender...",
			"MaleGender": "Male",
			"FemaleGender": "Female",
			"DontCareGender": "I don't care",
			"Awards": "AWARDS",
			"AwardsPlaceholder": "by awards...",
			"LevelTwoPlaceHolder": "Select a category",
			"BookSearchLink": "Book",
			"AuthorSearchLink": "Author",
			"ReaderSearchLink": "Reader",
			"SearchPlaceholder": "",
			"BookByYearLink": "Find books by era",
			"BookByReadingTimeLink": "Find books by reading time",
			"BookByRegionLink": "Find books by region",
			"BookByGenreLink": "Find books by genre",
			"BookListsLink": "Get popular lists of books",
			"BookByAuthorLink": "Find books by author",
			"AuthorByYearLink": "Find authors by era",
			"AuthorByRegionLink": "Find authors by region",
			"AuthorByAwardsLink": "Find authors by awards",
			"AuthorsByGenreLink" :"Find authors by genre",
			"AuthorListsLink" : "Get popular lists of authors",
			"ReaderByRegionLink": "Find readers by region",
			"ReaderByTasteLink": "Find readers by their taste",
			"ReaderByGenderLink": "Find readers by gender",
			"ReaderListsLink": "Get popular lists of readers",
			"SearchingWebsite": "Searching reader's door...",
			"SearchAll": "ALL",
			"Hash": "#",
			"Plus": "+",
			"AtTheRate": "@",
			"SearchingAuthorsAndReaders": "Searching authors and readers...",
			"SearchingTags": "Searching books categories...",
			"TagSearch": "TAG"
		},
		"WebsiteUIConstants":{
			"LeftPanelMinWidth": "20%",
			"ServerError": "Something went wrong. Please refresh the page and try again.",
			"Share": "Share your book reading journey...",
			"BrowserIncompatible": "Please use latest version of Chrome for now...",
			"Enter": 13,
			"Backspace": 8,
			"KeyUp": 38,
			"KeyDown": 40,
			"KeyLeft": 37,
			"KeyRight": 39,
			"Delete": 46,
			"Escape": 27,
			"StatusPosted": "Shared",
			"CoverPhotoCDN": "http://rd-images.readersdoor.netdna-cdn.com/cp/"
		},
		"ColorConstants":{
			"value": ["#695447", "#d1d2de", "#c4c2b5", "#675850", "#83817f", "#b3b2b1", "#839baa", "#4867a4", "#423b34", "#e4bc7e", "#987c4e", "#8c7971", "#ad9894", "#565240", "#5d2726"]
		},
		"StatusUIConstants":{
			"EmotionConstants":{
				"icon": "icon-happy",
				"name": "Emotion",
				"value": [
					{
						"name": "Currently reading",
						"icon": "i-reading",
						"label": "Reading",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					},
					{
						"name": "Feeling", 
						"icon": "i-feeling",
						"label": "Feeling", 
						"value": emotions,
						"icon2": "icon-book"
					},
					{
						"name": "Thinking about",
						"icon": "i-thinking",
						"label": "Thinking",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					},
					{
						"name": "Smelling pages of",
						"icon": "i-smelling",
						"label": "Smelling",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					},
					{
						"name": "Counting pages of",
						"icon": "i-counting",
						"label": "Counting",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					}
				]
			},
			"OwnershipConstants":{
				"icon": "icon-feed",
				"name": "Shout",
				"value": [
					{
						"name": "Looking to buy",
						"icon": "",
						"value": [
							{"SearchBook": true}
						]
					},
					{
						"name": "Looking to borrow",
						"icon": "",
						"value": [
							{"SearchBook": true}
						]
					},
					{
						"name": "Willing to lend",
						"icon": "",
						"value": [
							{"SearchBook": true}
						]
					}
				]
			},
			"QuoteConstants":{
				"icon": "icon-quote-right",
				"name": "Quote"
			}

		}
	}


angular.forEach(constants, function(key, value) {
  	appConstants.constant(value, key);
});