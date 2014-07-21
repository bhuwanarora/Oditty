class Ebook < ActiveRecord::Base
	attr_accessible :name, :notes, :url
	has_and_belongs_to_many :shelfari_books
end