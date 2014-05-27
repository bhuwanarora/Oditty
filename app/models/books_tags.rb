class BooksTags < ActiveRecord::Base
	attr_accessible :book_id, :tag_id
	belongs_to :book
	belongs_to :tag
end