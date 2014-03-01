class GoodReadsGenre < ActiveRecord::Base
	attr_accessible :name, :url, :flag, :book_count
	has_and_belongs_to_many :tags
	has_and_belongs_to_many :good_reads_books
end
