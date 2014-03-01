class Publisher < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	
	attr_accessible :name, :url,  :publishing_details_id
	belongs_to :publishing_details, :class_name => "::Book::PublishingDetails"


	def self.create_publishers openlibrary_publishers
		@publishers = []
		openlibrary_publishers.each do |publisher|
			@publisher = Publisher.find_by_name(publisher["name"])
			unless @publisher.present?
				@publisher = Publisher.new(:name => publisher["name"], :url => publisher["url"])
				if @publisher.save
					@publishers |= [@publisher]
				end
			else
				@publishers |= [@publisher]
			end
		end
		@publishers
	end
end
