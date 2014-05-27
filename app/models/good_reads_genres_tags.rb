class GoodReadsGenresTags < ActiveRecord::Base
	attr_accessible :good_reads_genre_id, :tag_id
	belongs_to :good_reads_genre
	belongs_to :tag
end