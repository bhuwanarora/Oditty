class Tag < ActiveRecord::Base
	attr_accessible :name, :description, :url
	has_and_belongs_to_many :books
	has_and_belongs_to_many :good_reads_genres

	def self.create_tags details
		@tags = []
		details.each do |detail|
			@tag = Tag.find_or_create_by(:name => detail["name"])
			@tag.update_attributes(:url => detail["url"])
			@tags |= [@tag]
		end
		@tags
	end
end
