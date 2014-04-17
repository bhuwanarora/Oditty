class GoodReadsBook < ActiveRecord::Base
	attr_accessible :url, :description, :rating, :title, :author_name, :isbn, :flag,
					:author_url, :reviews_count, :ratings_count, :page_count,
					:published_year
	has_and_belongs_to_many :good_reads_genres
end
