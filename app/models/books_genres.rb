class BooksGenres < ActiveRecord::Base
	attr_accessible :book_id, :genre_id
	has_many :books
	has_many :genres
end