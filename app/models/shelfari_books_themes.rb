class ShelfariBooksThemes < ActiveRecord::Base
	attr_accessible :theme_id, :shelfari_book_id, :description
	belongs_to :shelfari_book
	belongs_to :theme
end