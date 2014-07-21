class BookSeries < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	
	attr_accessible :name
	has_many :books
end
