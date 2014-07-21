class ShelfariTag < ActiveRecord::Base
	attr_accessible :name, :url, :flag
	has_and_belongs_to_many :shelfari_books
end
