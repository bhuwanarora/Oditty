class GoodReadsBook < ActiveRecord::Base
	attr_accessible :url, :description, :rating, :title, :authorName, :isbn, :flag
	has_and_belongs_to_many :good_reads_genres
end
