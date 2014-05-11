class MoviesShelfariBooks < ActiveRecord::Base
	attr_accessible :movie_id, :shelfari_book_id, :description
	belongs_to :movie
	belongs_to :shelfari_book
end