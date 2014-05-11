class Book::SubjectPlace < ActiveRecord::Base
	attr_accessible :name, :url
	has_and_belongs_to_many :books, :class_name => "::Book"

	def self.create_subject_places openlibrary_subject_places
		@subject_places = []
		unless openlibrary_subject_places.nil?
			openlibrary_subject_places.each do |subject_place|
				@subject_place = Book::SubjectPlace.find_by_name(subject_place["name"])
				unless @subject_place.present?
					@subject_place = Book::SubjectPlace.new(:name => subject_place["name"], :url => subject_place["url"])
					if @subject_place.save
						@subject_places |= [@subject_place]
					end
				else
					@subject_places |= [@subject_place]
				end
			end
			@subject_places
		end
	end
end
