class QuotesShelfariBooks < ActiveRecord::Base
	attr_accessible :quote_id, :shelfari_book_id
	belongs_to :shelfari_book
	belongs_to :quote
end