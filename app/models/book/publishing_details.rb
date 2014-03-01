class Book::PublishingDetails < ActiveRecord::Base
	attr_accessible :date, :book_id
	has_many :publishers
	belongs_to :book

	def self.create_publishing_detail(places, date, publishers)
		@publishing_details = Book::PublishingDetails.new(:date => date)
		if @publishing_details.save
			@publishing_details.publishers = publishers
			@publishing_details.save
		end
		@publishing_details
	end
end
