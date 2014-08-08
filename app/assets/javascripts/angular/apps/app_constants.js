var appConstants = angular.module('appConstants', []);

var emotions = [
	{"name": "nostalgic while reading", 	"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "enlightened while reading", 	"icon": "icon-smiley", 	"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "insane while reading",	 	"icon": "icon-grin2", 	"value": [{"SearchBook": true}], "icon2": "icon-book"}, 
	{"name": "happy while reading", 		"icon": "icon-happy", 	"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "sad while reading", 			"icon": "icon-sad", 	"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "frustrated while reading", 	"icon": "icon-angry", 	"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "bored while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "scared while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "funny while reading", 		"icon": "icon-tongue", 	"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "confused while reading", 		"icon": "icon-confused", "value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "romantic while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "inspired while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "out of the world while reading", "icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "alone while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "loved while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "upset while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "awesome while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "sleepy while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "crazy while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "heartbroken while reading", 	"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "irritated while reading", 	"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "wonderful while reading", 	"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "blessed while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "lonely while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "bored while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "incomplete while reading", 	"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "hopeful while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "hurt while reading", 			"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "great while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "high while reading", 			"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "pumped while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "drained while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "old while reading", 			"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "naughty while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "guilty while reading", 		"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "low while reading", 			"icon": "", 			"value": [{"SearchBook": true}], "icon2": "icon-book"},
	{"name": "excited while reading", 		"icon": "icon-wink",	"value": [{"SearchBook": true}], "icon2": "icon-book"}
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
			"FriendsGridMaxHeight": "250px",
			"NotificationsMinHeight": "110px",
			"BookmarkPanel": 'BOOKMARK',
			"BookTab": "BOOK",
			"AuthorTab": "AUTHOR",
			"ReaderTab": "READER",
			"ZeroBooksFound": "ALERT- Reset the filters couldn't find more books."
		},
		"SearchUIConstants": {
			"ComingSoon": "Coming Soon...",
			"BookSearch": "BOOK",
			"BookSearchPlaceholder": "Search Books...",
			"SearchingBooks": "Searching Books...",
			"AuthorSearch": "AUTHOR",
			"AuthorSearchPlaceholder": "Search Authors...",
			"AuthorPlaceholder": "by author...",
			"SearchingAuthors": "Searching Authors...",
			"ReaderSearch": "READER",
			"ReaderSearchPlaceholder": "Search Readers...",
			"SearchingReaders": "Searching Readers...",
			"Year": "YEAR",
			"YearPlaceholder": "by year...",
			"List": "LIST",
			"ListPlaceholder": "by list...",
			"Country": "COUNTRY",
			"CountryPlaceholder": "by country...",
			"Genre": "GENRE",
			"GenrePlaceholder": "by genre...",
			"Time" :"TIME",
			"TimePlaceholder": "by time...",
			"Gender": "GENDER",
			"GenderPlaceholder": "by gender...",
			"MaleGender": "Male",
			"FemaleGender": "Female",
			"DontCareGender": "I don't care",
			"Awards": "AWARDS",
			"AwardsPlaceholder": "by awards...",
			"LevelTwoPlaceHolder": "Select a category",
			"BookSearchLink": "Search a Book",
			"AuthorSearchLink": "Search an Author",
			"ReaderSearchLink": "Search a Reader",
			"SearchPlaceholder": "Search...",
			"BookByYearLink": "Find Books by Era",
			"BookByReadingTimeLink": "Find Books by Reading Time",
			"BookByRegionLink": "Find Books by Author's Region",
			"BookByGenreLink": "Find Books by Genre",
			"BookListsLink": "Get popular lists of Books",
			"BookByAuthorLink": "Get Books by Author",
			"AuthorByYearLink": "Find Authors by Era",
			"AuthorByRegionLink": "Find Authors by Region",
			"AuthorByAwardsLink": "Find Authors by Awards",
			"AuthorsByGenreLink" :"Find Authors by Genre",
			"AuthorListsLink" : "Get popular lists of Authors",
			"ReaderByRegionLink": "Find Readers by Region",
			"ReaderByTasteLink": "Find Readers by their Taste",
			"ReaderByGenderLink": "Find Readers by Gender",
			"ReaderListsLink": "Get popular lists of Readers",
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
							{"name": "on Mountains", "icon": "", "value": [{"SearchBook": true}]},
							{"name": "on Bed", "icon": "", "value": [{"SearchBook": true}]},
							{"name": "on Train", "icon": "", "value": [{"SearchBook": true}]}
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