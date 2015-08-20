module Constant::RatingIndices
	MaxBookPopularityIndex				= 10
	MaxBookReaderRelationshipIndex 		= 10
	MaxBookLikabilityIndex 				= 10
	MaxBookGoodnessIndex 				= 10

	AlphaBookReaderRelationshipIndex	= 25

	BookPopularityIndex = 'popularity_index'
	BookGoodnessIndex	= 'goodness_index'
	BookLikabilityIndex = 'likeability_index'
	BookReaderRelationshipIndex = 'book_reader_relationship_index'
	BookMetrics = [BookPopularityIndex, BookGoodnessIndex, BookLikabilityIndex, BookReaderRelationshipIndex]
end