class Prize < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	
	attr_accessible :name
	has_and_belongs_to_many :authors
end
