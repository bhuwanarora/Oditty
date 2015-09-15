module Constant::Label
	TinyRead 					= "tinyread"
	SmallRead 					= "smallread"
	NormalRead 					= "normalread"
	LongRead 					= "longread"

	TinyReadRelation 			= "NextTinyRead"
	SmallReadRelation 			= "NextSmallRead"
	NormalReadRelation 			= "NextNormalRead"
	LongReadRelation 			= "NextLongRead"

	Time 						= "TIME"
	Year 						= "YEAR"
	Country 					= "COUNTRY"
	Author 						= "AUTHOR"
	Genre 						= "GENRE"

	HiddenCommunity				= "HiddenCommunity"


	AllLabels = [TinyRead, SmallRead, NormalRead, LongRead, TinyReadRelation, SmallReadRelation, NormalReadRelation, LongReadRelation, Time, Year, Country, Author, Genre, HiddenCommunity]

	AllNeoLabels = AllLabels + Constant::EntityLabel::AllLabels + Constant::NodeLabel::AllLabels
end