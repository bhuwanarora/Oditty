class Category < ActiveRecord::Base
	has_ancestry
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	attr_accessible :name

	def name=(value)
		write_attribute(:name, value.upcase)
	end
end