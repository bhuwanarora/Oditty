class AuthorsShelfariBooks < ActiveRecord::Base
	attr_accessible :author_id, :shelfari_book_id
	belongs_to :author
	belongs_to :shelfari_book
end