class ShelfariCategory < ActiveRecord::Base
	has_ancestry
	attr_accessible :name, :url, :order, :flag, :blue_flag
	has_and_belongs_to_many :shelfari_books
end
