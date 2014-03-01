class GoodReadsBooksGenres < ActiveRecord::Base
	attr_accessible :good_reads_book_id, :good_reads_genre_id
	belongs_to :good_reads_genre
	belongs_to :good_reads_book
end