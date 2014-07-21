class LocationsShelfariBooks < ActiveRecord::Base
	attr_accessible :location_id, :shelfari_book_id, :description
	belongs_to :location
	belongs_to :shelfari_book
end