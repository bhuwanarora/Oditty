class Character < ActiveRecord::Base
	attr_accessible :name, :shelfari_url, :description
	has_and_belongs_to_many :shelfari_books
end