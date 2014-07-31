var appConstants = angular.module('appConstants', []);

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
			"BrowserIncompatible": "Please use latest version of Chrome for now..."
		}
	}


angular.forEach(constants, function(key, value) {
  	appConstants.constant(value, key);
});