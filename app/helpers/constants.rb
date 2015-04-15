module Constants
	CategoryLikeWeight			= 10
	MarkAsReadPoints 			= 5
	# BookmarkPoints 				= 5
	RatingPoints				= 10
	BookmarkPoints				= 10
	ReadTimePoints				= 10
	ThumbSuggest				= 10
	RecommendationPoints		= 10
	QueryStepDuringLinking		= 1000
	CommunityBooksCount 		= 10
	CommunityUsersCount         = 10
	NewsShownInCommunityCount   = 7
	CommunitiesShown            = 7 
	if Rails.env.development?
		Admin						= 0
		BestTinyRead				= 395911 #"thelosthero"
		BestSmallRead				= 390072 #"thelittleprince"
		BestNormalRead				= 1171520 #"harrypotterandthephilosophersstone"
		BestLongRead				= 395153 #"thehungergames"
		BestBook					= 395153 #"thehungergames"
		BestGrid					= 2594148
	else
		Admin						= 4084079
		BestTinyRead				= 395910 #"thelosthero"
		BestSmallRead				= 390071 #"thelittleprince"
		BestNormalRead				= 1171522 #"harrypotterandthephilosophersstone"
		BestLongRead				= 395152 #"thehungergames"
		BestBook					= 395152 #"thehungergames"
		BestGrid					= 2594148
	end

	InvalidLink					= "Invalid Link"
	LoginSuccess				= "Logged in successfully."
	AuthenticationFailed		= "Email and password doesn't match."
	VerifyEmail					= "Please verify your email address."
	EmailNotRegistered			= "Email not registered."
	EmailAlreadyRegistered		= "Email already registered. Please check your inbox to reset password if you have forgotten."
	ActivateAccount				= "We have sent you an email with an activation link. Please activate your account."
	AnotherActivationRequest	= "Please activate your email account. We are sending you another mail."
	EmailConfirmed				= "Email Verified. We have recieved your request and will soon be able give access. Please bear with us."
	EmailConfirmationFailed		= "Email Confirmation Failed."
	PendingActivation			= "We will soon give access to your account. Please bear with us."
	PasswordRecoveryInitiated	= "A link to recover your password has been sent to the given email id."
	PasswordChangedSuccess	 	= "Password saved. Redirecting to home page."
	PasswordChangedFailure		= "Error while saving the new password. Please try again."

	TinyRead 					= "tinyread"
	SmallRead 					= "smallread"
	NormalRead 					= "normalread"
	LongRead 					= "longread"

	TinyReadRelation 			= "NextTinyRead"
	SmallReadRelation 			= "NextSmallRead"
	NormalReadRelation 			= "NextNormalRead"
	LongReadRelation 			= "NextLongRead"

	TinyReadNode	 			= 772853
	SmallReadNode	 			= 772854
	NormalReadNode	 			= 772855
	LongReadNode	 			= 772856

	OldEnglishLiterature		= 422360
	MiddleEnglishLiterature		= 422363
	EnglishRenaissance 			= 422367
	NeoClassicalPeriod 			= 422368
	Romanticism 				= 422371
	VictorianLiterature 		= 422372
	Modernism 					= 422373
	PostModernLiterature 		= 422374
	Contemporary				= 422375

	SessionNotSet				= "Session not set properly error..."



	Time 						= "TIME"
	Year 						= "YEAR"
	Country 					= "COUNTRY"
	Author 						= "AUTHOR"
	Genre 						= "GENRE"

	module EmailTemplate
		PasswordReset			= "PasswordReset"
		EmailVerification		= "email_verification"
		RecommendBooks			= "RecommendBooks"
	end

	UniqueNewsCount  			= 50
	BookCountShownOnSignup  	= 30
	ChildBookCountRange  		= "0-20"
	AdoloscentBookCountRange 	= "20-50"
	AboutToBeAdultBookCountRange= "50-100"
	AdultBookCountRange  		= "100-250"
	AboutToDieBookCountRange  	= "250+"
	InitialSkipCount        	= 0
	RelevantSocialTagValue      = 1
	RecommendationBookCount 	= 10
	FollowFavoriteAuthorsCount  = 30 
	QueryStepDuringLinking      = 1000
	ArticlesShownInRoomCount    = 10
	BooksShownInRoomCount       = 10
	PopularBooksShownCount      = 30
	FeedFetchCount				= 4 
	PlanningToReadStatusCode	= 0
	CurrentlyReadingStatusCode  = 1
	ReadStatusCode 				= 2
	PlanningToBuyStatusCode     = 0
	PlanningToLendStatusCode	= 1
	PlanningToBorrowStatusCode  = 2
	EndorsePoints 				= 10
	TinyReadValue	 			= 0
	SmallReadValue	 			= 1
	NormalReadValue	 			= 2
	LongReadValue	 			= 3
	BookShownInInfinty          = 10
	MaximumCommunityBooksCount	= 10
	MinimumCommunityBooksCount  = 5
end