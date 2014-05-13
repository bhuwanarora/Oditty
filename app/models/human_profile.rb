class HumanProfile < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	
	attr_accessible :name, :born_on, :is_alive, :profession_id, :gender_id, :address_id, :openlibrary_url
	belongs_to :address, :class_name => "::HumanProfile::Address"
	belongs_to :profession
	belongs_to :gender

	# def name
	# 	"@#{read_attribute(:name)}"
	# end
end