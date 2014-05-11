class CharactersShelfariBooks < ActiveRecord::Base
	attr_accessible :character_id, :shelfari_book_id
	belongs_to :character
	belongs_to :shelfari_book
end