class Book::Cover < ActiveRecord::Base
	attr_accessible :small, :medium, :large, :book_id, :other_info
	belongs_to :book, :class_name => "::Book"
end
