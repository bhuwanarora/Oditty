class ShelfariBook < ActiveRecord::Base
	attr_accessible :name, :url, :summary, :flag, :description, :first_sentence, :data_flag
	has_and_belongs_to_many :shelfari_tags
	has_and_belongs_to_many :shelfari_categories
	has_and_belongs_to_many :locations
	has_and_belongs_to_many :characters
	has_and_belongs_to_many :themes
	has_and_belongs_to_many :note_for_parents
	has_and_belongs_to_many :quotes
	has_and_belongs_to_many :movies
	has_and_belongs_to_many :authors
	has_and_belongs_to_many :ebooks
end
