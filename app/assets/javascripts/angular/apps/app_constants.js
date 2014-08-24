var appConstants = angular.module('appConstants', []);

var emotions = [
	{"name": "nostalgic", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "enlightened", "icon": "icon-smiley", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "insane", "icon": "icon-grin2", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"}, 
	{"name": "happy", "icon": "icon-happy", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "sad", "icon": "icon-sad", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "frustrated", "icon": "icon-angry", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "bored", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "scared", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "funny", "icon": "icon-tongue", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "confused", "icon": "icon-confused","value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "romantic", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "inspired", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "out of the world", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "alone", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "loved", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "upset", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "awesome", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "sleepy", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "crazy", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "heartbroken", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "irritated", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "wonderful", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "blessed", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "lonely", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "bored", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "incomplete", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "hopeful", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "hurt", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "great", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "high", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "pumped", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "drained", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "old", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "naughty", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "guilty", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "low", "icon": "", "value": [{"SearchBook": true}], "icon2": "icon-book", "link": "while reading"},
	{"name": "excited", "icon": "icon-wink","value": [{"SearchBook": true}], "icon2": "icon-book"}
]


var constants = {
		"LoginConstants": {
			"EmailNotPresent": "Enter your email address",
			"PasswordNotPresent": "Enter your password",
			"PasswordLengthError": "Minimum password length is 8",
			"ChooseAMoreSecurePassword": "Choose a more secure password",
			"MaximumPasswordLengthError": "Maximum password length is 100",
			"FacebookLoginStatusCheck" :"connected"
		},
		"RecommendationUIConstants": {
			"TickerPopupMaxHeight": "62vh",
			"FriendsGridMaxHeight": "500px",
			"FriendsGridMinHeight": "250px",
			"NotificationsMinHeight": "30vh",
			"NotificationsMaxHeight": "70vh",
			"BookmarkPanel": 'BOOKMARK',
			"BookTab": "BOOK",
			"AuthorTab": "AUTHOR",
			"ReaderTab": "READER",
			"ZeroBooksFound": "ALERT- Reset the filters couldn't find more books."
		},
		"SearchUIConstants": {
			"ComingSoon": "Coming Soon...",
			"NoResultsFound": "No results found...",
			"BookSearch": "BOOK",
			"BookSearchPlaceholder": "Search books...",
			"SearchingBooks": "Searching books...",
			"AuthorSearch": "AUTHOR",
			"AuthorSearchPlaceholder": "Search authors...",
			"AuthorPlaceholder": "Add an author to filters...",
			"SearchingAuthors": "Searching authors...",
			"ReaderSearch": "READER",
			"ReaderSearchPlaceholder": "Search readers...",
			"SearchingReaders": "Searching readers...",
			"SearchingGenres": "Searching genres...",
			"SearchingAuthors": "Searching authors...",
			"Year": "YEAR",
			"YearPlaceholder": "Add a published year to filters...",
			"List": "LIST",
			"ListPlaceholder": "by list...",
			"Country": "COUNTRY",
			"CountryPlaceholder": "Add a country to filters...",
			"Genre": "GENRE",
			"GenrePlaceholder": "Add a genre to filters...",
			"Time" :"TIME",
			"TimePlaceholder": "Add a reading time to fitlers...",
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
			"SearchPlaceholder": "Search for a book, author, or a reader...",
			"BookByYearLink": "Find books by era",
			"BookByReadingTimeLink": "Find books by reading time",
			"BookByRegionLink": "Find books by region",
			"BookByGenreLink": "Find books by genre",
			"BookListsLink": "Get popular lists of books",
			"BookByAuthorLink": "Get books by author",
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
			"BrowserIncompatible": "Please use latest version of Chrome for now...",
			"Enter": 13,
			"Backspace": 8,
			"KeyUp": 38,
			"KeyDown": 40,
			"KeyLeft": 37,
			"KeyRight": 39,
			"Delete": 46,
			"Escape": 27,
			"StatusPosted": "Shared"
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
						"name": "Feeling", 
						"icon": "icon-neutral",
						"label": "Feeling", 
						"value": emotions,
						"icon2": "icon-book"
					},
					{
						"name": "Thinking about",
						"icon": "",
						"label": "Thinking",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					},
					{
						"name": "Smelling pages of",
						"icon": "",
						"label": "Smelling",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					},
					{
						"name": "Counting pages of",
						"icon": "",
						"label": "Counting",
						"icon2": "icon-book",
						"value": [{"SearchBook": true}]
					},
					{
						"name": "Reading",
						"icon": "",
						"label": "Reading",
						"icon2": "icon-book",
						"value": [
							{"SearchBook": true},
							{"name": "on mountains", "icon": "", "value": [{"SearchBook": true}]},
							{"name": "on bed", "icon": "", "value": [{"SearchBook": true}]},
							{"name": "on train", "icon": "", "value": [{"SearchBook": true}]}
						]
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
						"name": "Looking to give",
						"icon": "",
						"value": [
							{"SearchBook": true}
						]
					},
					{
						"name": "Looking to read",
						"icon": "",
						"value": [
							{"SearchBook": true}
						]
					},
					{
						"name": "Gifted",
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