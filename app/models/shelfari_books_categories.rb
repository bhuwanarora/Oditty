class ShelfariBooksCategories < ActiveRecord::Base
	attr_accessible :shelfari_book_id, :shelfari_category_id
	belongs_to :shelfari_category
	belongs_to :shelfari_book
end