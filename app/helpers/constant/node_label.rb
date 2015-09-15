module Constant::NodeLabel
	FollowsNode		= "FollowsNode"
	RecommendNode 	= "RecommendNode"
	EndorseNode 	= "EndorseNode"
	BorrowNode 		= "BorrowNode"
	StatusNode		= "StatusNode"
	BookmarkNode	= "BookmarkNode"
	RatingNode		= "RatingNode"

	BooklessCommunity 	= "BooklessCommunity"
	Category			= "Category"
	Genre				= "Genre"

	Hidden			= "Hidden"

	BookEraLabels = ["PostModernLiterature", "Modernism", "VictorianLiterature", "Romanticism", "NeoClassicalPeriod", "EnglishRenaissance", "MiddleEnglishLiterature", "OldEnglishLiterature", "Contemporary"]

# FACEBOOK LIKES 
	City			= "City"
	Country			= "Country"
	Street			= "Street"
	Address			= "Address"

	AllLabels = [FollowsNode, RecommendNode, EndorseNode, BorrowNode, StatusNode, BookmarkNode, RatingNode, BooklessCommunity, Category, Genre, City, Country, Street, Address ] + BookEraLabels
end