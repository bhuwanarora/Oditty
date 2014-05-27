class Quote < ActiveRecord::Base
	attr_accessible :name, :url, :person_url, :person, :flag
	has_and_belongs_to_many :shelfari_books
end
