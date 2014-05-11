class Movie < ActiveRecord::Base
	attr_accessible :name, :imdb_url, :year
	has_and_belongs_to_many :shelfari_books
end
