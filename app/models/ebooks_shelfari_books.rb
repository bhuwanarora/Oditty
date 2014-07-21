class EbooksShelfariBooks < ActiveRecord::Base
	attr_accessible :ebook_id, :shelfari_book_id
	belongs_to :ebook
	belongs_to :shelfari_book
end