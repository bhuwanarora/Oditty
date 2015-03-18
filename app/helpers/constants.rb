module Constants
	InfluentialBooks			="influentialbooks"
	MarkAsReadPoints 			= 5
	# BookmarkPoints 				= 5
	RatingPoints				= 10
	BookmarkPoints				= 10
	ReadTimePoints				= 10
	ThumbSuggest				= 10
	RecommendationPoints		= 10

	if Rails.env.development?
		Admin						= 0
		BestTinyRead				= 395910 #"thelosthero"
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

	OldEnglishLiterature		= "oldenglish"
	MiddleEnglishLiterature		= "middleenglish"
	EnglishRenaissance 			= "englishrenaissance"
	NeoClassicalPeriod 			= "neoclassical"
	Romanticism 				= "romantic"
	VictorianLiterature 		= "victorian"
	Modernism 					= "modern"
	PostModernLiterature 		= "postmodern"
	Contemporary				= "contemporary"

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
	AboutToBeAdultBookCountRange  = "50-100"
	AdultBookCountRange  		= "100-250"
	AboutToDieBookCountRange  	= "250+"
	InitialSkipCount        	= 0
	RelevantSocialTagValue      = 1
	BookLeftAMarkOnYouUpcase 	= "BOOKSLEFTAMARKONYOU"
	FromFacebookUpcase   		= "FROMFACEBOOK"
	MarkAsReadUpcase            = "MARKASREAD"
end